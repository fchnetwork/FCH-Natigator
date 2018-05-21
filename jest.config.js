module.exports = {
    "preset": "jest-preset-angular",
    "roots": [
        "<rootDir>/src/"
    ],
    "setupTestFrameworkScriptFile": "<rootDir>/src/setup-jest.ts",
    "moduleNameMapper": {
        "^@app(.*)$": "<rootDir>/src/app$1",
        "^@core(.*)$": "<rootDir>/src/app/core$1",
        "^@(account|shared)(.*)$": "<rootDir>/src/app/$1$2",
        "^@(dashboard|explorer|transaction|diagnostics|aens|swap)(.*)$": "<rootDir>/src/app/wallet/$1$2",
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
    "transform": {
        "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
        "^.+\\.js$": "babel-jest"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!@ngrx|angular2-ui-switch|ng-dynamic|ngx-webstorage)"
    ]
};
