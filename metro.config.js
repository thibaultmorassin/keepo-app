const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/**
 * react-native-css signals that a CSS file recompiled by emitting a synthetic
 * `change` event on Metro's file map, using the legacy `{ eventsQueue: [...] }`
 * payload. The Metro vendored by Expo SDK 57 replaced that shape with
 * `{ changes: { addedFiles, modifiedFiles, removedFiles }, rootDir }`, whose
 * consumers read `changes.addedFiles` — so the old payload crashes the bundler
 * with "Cannot read properties of undefined (reading 'addedFiles')".
 *
 * Translate the legacy payload on its way out. Both consumers (DependencyGraph
 * and DeltaCalculator) resolve entries with `path.join(rootDir, canonicalPath)`,
 * so paths have to be relative to the project root.
 */
function withLegacyWatcherChangeEvents(config) {
  const originalEnhanceMiddleware = config.server?.enhanceMiddleware;
  const rootDir = config.projectRoot ?? __dirname;

  return {
    ...config,
    server: {
      ...config.server,
      enhanceMiddleware(middleware, metroServer) {
        const watcher = metroServer.getBundler().getBundler().getWatcher();

        if (watcher && !watcher.__keepoLegacyChangeShim) {
          watcher.__keepoLegacyChangeShim = true;
          const emit = watcher.emit.bind(watcher);

          watcher.emit = (event, payload, ...rest) => {
            if (event !== "change" || !payload?.eventsQueue || payload.changes) {
              return emit(event, payload, ...rest);
            }

            const modifiedFiles = payload.eventsQueue.map((entry) => [
              path.relative(rootDir, entry.filePath),
              {
                isSymlink: false,
                modifiedTime: entry.metadata?.modifiedTime ?? Date.now(),
              },
            ]);

            return emit(
              "change",
              {
                changes: {
                  addedDirectories: new Map(),
                  removedDirectories: new Map(),
                  addedFiles: new Map(),
                  modifiedFiles,
                  removedFiles: new Map(),
                },
                logger: null,
                rootDir,
              },
              ...rest,
            );
          };
        }

        return originalEnhanceMiddleware
          ? originalEnhanceMiddleware(middleware, metroServer)
          : middleware;
      },
    },
  };
}

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withLegacyWatcherChangeEvents(
  withNativewind(config, {
    // inline variables break PlatformColor in CSS variables
    inlineVariables: false,
    // className support is added manually via tw/
    globalClassNamePolyfill: false,
  }),
);
