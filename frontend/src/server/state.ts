const escapeForScript = (json: string) => json.replace(/</g, '\u003c');

export const stateScript = (state: unknown) => `<script>window.__PRELOADED_STATE__=${escapeForScript(JSON.stringify(state))}</script>`;
