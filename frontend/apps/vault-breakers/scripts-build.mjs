// Runs `vite build` and exits once the static adapter reports it has written the site.
// Works around the build process staying alive afterwards (a sass-embedded child process
// keeps Node's event loop open in this toolchain), which made `pnpm build` hang.
import { spawn } from 'node:child_process';

const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], { stdio: ['ignore', 'pipe', 'inherit'] });
let wrote = false;
child.stdout.on('data', (buf) => {
	const text = buf.toString();
	process.stdout.write(text);
	if (text.includes('Wrote site to')) wrote = true;
	if (wrote && /\bdone\b/.test(text)) {
		setTimeout(() => { child.kill('SIGTERM'); process.exit(0); }, 500);
	}
});
child.on('exit', (code) => process.exit(wrote ? 0 : code ?? 1));
