module.exports = {
    "preset": "jest-preset-angular",
    "setupTestFrameworkScriptFile": "<rootDir>/src/setup-jest.ts",
    "moduleNameMapper": {
        "^@app(.*)$": "<rootDir>/src/app$1",
        "^@core(.*)$": "<rootDir>/app/core$1",
        "^@(account|shared)(.*)$": "<rootDir>/src/app/$1$2",
        "^@(dashboard|explorer|transaction|diagnostics)(.*)$": "<rootDir>/src/app/wallet/$1$2",
        "^@env(.*)$": "<rootDir>/src/environments$1"
    },
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "transformIgnorePatterns": [
        "node_modules/(?!ngx-webstorage)",
        "node_modules/(?!@ngrx)"
    ]
};