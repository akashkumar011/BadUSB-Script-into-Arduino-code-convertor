export type DuckyAst = {
  commands: Array<{ type: string; args: string[] }>;
  errors: string[];
};

const SIMPLE_COMMANDS = new Set(['ENTER','RETURN','TAB','ESC','ESCAPE','SPACE','BACKSPACE','DELETE','UP','DOWN','LEFT','RIGHT','HOME','END','PAGEUP','PAGEDOWN','CAPSLOCK','SCROLLLOCK','NUMLOCK','PAUSE','INSERT','PRINTSCREEN','MENU','APP','WINDOWS','GUI']);

export function parseDuckyScript(input: string): DuckyAst {
  const commands: DuckyAst['commands'] = [];
  const errors: string[] = [];
  const lines = input.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line || line.startsWith('REM')) continue;

    const [cmd, ...rest] = line.split(/\s+/);
    const upper = cmd.toUpperCase();

    if (upper === 'STRING') {
      const args = [raw.slice(raw.toUpperCase().indexOf('STRING') + 6).trimStart()];
      commands.push({ type: 'STRING', args });
      continue;
    }

    if (upper === 'DELAY') {
      const ms = parseInt(rest[0], 10);
      if (Number.isFinite(ms)) commands.push({ type: 'DELAY', args: [String(ms)] });
      else errors.push(`Line ${i + 1}: DELAY requires a number`);
      continue;
    }

    if (upper === 'REPEAT') {
      const n = parseInt(rest[0], 10);
      if (!Number.isFinite(n) || n < 1) {
        errors.push(`Line ${i + 1}: REPEAT requires positive number`);
        continue;
      }
      if (commands.length === 0) {
        errors.push(`Line ${i + 1}: REPEAT without previous command`);
        continue;
      }
      const last = commands[commands.length - 1];
      for (let j = 0; j < n; j++) commands.push({ ...last });
      continue;
    }

    // modifiers and simple keys
    const parts = [upper, ...rest.map((s) => s.toUpperCase())];
    if (parts.includes('GUI')) commands.push({ type: 'MOD', args: ['GUI', ...parts.filter(p => p !== 'GUI')] });
    else if (parts.includes('WINDOWS')) commands.push({ type: 'MOD', args: ['GUI', ...parts.filter(p => p !== 'WINDOWS')] });
    else if (parts.includes('CTRL') || parts.includes('CONTROL') || parts.includes('ALT') || parts.includes('SHIFT')) {
      commands.push({ type: 'MOD', args: parts });
    } else if (SIMPLE_COMMANDS.has(upper)) {
      commands.push({ type: upper, args: [] });
    } else {
      errors.push(`Line ${i + 1}: Unknown command '${cmd}'`);
    }
  }

  return { commands, errors };
}


