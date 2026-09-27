module.exports = {
    moduleNameMapper: {
        '\\.(scss|css)$': 'identity-obj-proxy',
    },
    moduleDirectories: [
        'node_modules',
        'src/Resources/js',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/src/Resources/package.json',
        '<rootDir>/vendor/',
    ],
    setupFiles: [
        'regenerator-runtime/runtime',
    ],
    setupFilesAfterEnv: [
        './tests/js/testSetup.config.js',
    ],
    clearMocks: true,
    testMatch: [
        '<rootDir>/tests/js/**/*.test.js',
    ],
    testURL: 'http://localhost',
    transformIgnorePatterns: [
        'node_modules/(?!(sulu-admin-bundle)/)',
    ],
};
