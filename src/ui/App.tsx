import { useMemo, useState } from 'react';
import { AppBar, Box, Button, Container, Divider, IconButton, Stack, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestoreIcon from '@mui/icons-material/Restore';
import { parseDuckyScript } from '../utils/ducky/parse';
import { generateArduinoSketch } from '../utils/arduino/generate';

const SAMPLE_SCRIPT = `REM Example DuckyScript\nDELAY 500\nSTRING Hello, world!\nENTER`;

export default function App() {
  const [script, setScript] = useState<string>(SAMPLE_SCRIPT);
  const [layout, setLayout] = useState<'us' | 'de' | 'uk'>('us');
  const [device, setDevice] = useState<'leonardo' | 'duemilanove' | 'proMicro'>('leonardo');

  const { arduinoCode, errors } = useMemo(() => {
    const ast = parseDuckyScript(script);
    const code = generateArduinoSketch({ ast, keyboardLayout: layout, target: device });
    return { arduinoCode: code, errors: ast.errors };
  }, [script, layout, device]);

  const download = () => {
    const blob = new Blob([arduinoCode], { type: 'text/x-arduino' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'duckify_plus.ino';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(arduinoCode);
  };

  const reset = () => setScript(SAMPLE_SCRIPT);

  return (
    <Box>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Duckify+ — BadUSB to Arduino
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Reset example">
              <IconButton onClick={reset}><RestoreIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Copy Arduino code">
              <IconButton onClick={copy}><ContentCopyIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Download .ino">
              <IconButton color="primary" onClick={download}><DownloadIcon /></IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">DuckyScript</Typography>
              <TextField
                value={script}
                onChange={(e) => setScript(e.target.value)}
                fullWidth
                multiline
                minRows={16}
                placeholder="Paste your DuckyScript here"
              />
              <Stack direction="row" spacing={1}>
                <TextField
                  select
                  label="Keyboard Layout"
                  SelectProps={{ native: true }}
                  value={layout}
                  onChange={(e) => setLayout(e.target.value as any)}
                  sx={{ minWidth: 200 }}
                >
                  <option value="us">US</option>
                  <option value="de">DE</option>
                  <option value="uk">UK</option>
                </TextField>
                <TextField
                  select
                  label="Target Board"
                  SelectProps={{ native: true }}
                  value={device}
                  onChange={(e) => setDevice(e.target.value as any)}
                  sx={{ minWidth: 220 }}
                >
                  <option value="leonardo">Arduino Leonardo</option>
                  <option value="proMicro">Arduino Pro Micro</option>
                  <option value="duemilanove">Arduino Duemilanove</option>
                </TextField>
              </Stack>
              {!!errors.length && (
                <Box sx={{ color: 'error.main' }}>
                  {errors.map((er, i) => (
                    <div key={i}>{er}</div>
                  ))}
                </Box>
              )}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Arduino Sketch Preview</Typography>
              <TextField value={arduinoCode} fullWidth multiline minRows={16} InputProps={{ readOnly: true }} />
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={copy} startIcon={<ContentCopyIcon />}>Copy</Button>
                <Button variant="contained" onClick={download} startIcon={<DownloadIcon />}>Download .ino</Button>
              </Stack>
              <Divider />
              <Typography variant="body2" color="text.secondary">
                Inspired by Duckify. This tool converts a subset of DuckyScript (STRING, DELAY, ENTER, GUI, ALT, CTRL, SHIFT, WINDOWS, MENU, etc.) into Arduino code using Keyboard.h.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


