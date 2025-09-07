import type { DuckyAst } from '../ducky/parse';

type GenerateOpts = {
  ast: DuckyAst;
  keyboardLayout: 'us' | 'de' | 'uk';
  target: 'leonardo' | 'duemilanove' | 'proMicro';
};

const KEY_MAP: Record<string, string> = {
  ENTER: 'KEY_RETURN',
  RETURN: 'KEY_RETURN',
  TAB: 'KEY_TAB',
  ESC: 'KEY_ESC',
  ESCAPE: 'KEY_ESC',
  SPACE: ' ',
  BACKSPACE: 'KEY_BACKSPACE',
  DELETE: 'KEY_DELETE',
  UP: 'KEY_UP_ARROW',
  DOWN: 'KEY_DOWN_ARROW',
  LEFT: 'KEY_LEFT_ARROW',
  RIGHT: 'KEY_RIGHT_ARROW',
  HOME: 'KEY_HOME',
  END: 'KEY_END',
  PAGEUP: 'KEY_PAGE_UP',
  PAGEDOWN: 'KEY_PAGE_DOWN',
  MENU: 'KEY_MENU'
};

function emitHeader(_: GenerateOpts): string {
  return `#include <Keyboard.h>\n\nvoid typeString(const char* s){\n  while(*s){\n    if(*s=='\\n'){ Keyboard.write(KEY_RETURN); } else { Keyboard.write(*s); }\n    delay(5);\n    s++;\n  }\n}\n\nvoid setup(){\n  delay(1000);\n  Keyboard.begin();\n`;
}

function emitFooter(): string {
  return `  Keyboard.end();\n}\n\nvoid loop(){}\n`;
}

export function generateArduinoSketch(opts: GenerateOpts): string {
  const { ast } = opts;
  const lines: string[] = [emitHeader(opts)];

  for (const c of ast.commands) {
    switch (c.type) {
      case 'STRING':
        lines.push(`  typeString(${JSON.stringify(c.args[0])});\n`);
        break;
      case 'DELAY':
        lines.push(`  delay(${c.args[0]});\n`);
        break;
      case 'MOD': {
        const keys = c.args.filter(Boolean);
        const last = keys[keys.length - 1];
        const mods = keys.slice(0, -1).map(k => mapMod(k)).filter(Boolean);
        for (const m of mods) lines.push(`  Keyboard.press(${m});\n`);
        lines.push(`  Keyboard.press(${mapKey(last)});\n  delay(5);\n  Keyboard.releaseAll();\n`);
        break;
      }
      default:
        if (KEY_MAP[c.type]) lines.push(`  Keyboard.write(${KEY_MAP[c.type]});\n`);
        else lines.push(`  // Unknown: ${c.type}\n`);
    }
  }

  lines.push(emitFooter());
  return lines.join('');
}

function mapMod(k: string): string | undefined {
  if (k === 'CTRL' || k === 'CONTROL') return 'KEY_LEFT_CTRL';
  if (k === 'ALT') return 'KEY_LEFT_ALT';
  if (k === 'SHIFT') return 'KEY_LEFT_SHIFT';
  if (k === 'GUI' || k === 'WINDOWS' || k === 'WIN') return 'KEY_LEFT_GUI';
  return undefined;
}

function mapKey(k: string): string {
  if (KEY_MAP[k]) return KEY_MAP[k];
  if (k && k.length === 1) return JSON.stringify(k);
  return 'KEY_RETURN';
}


