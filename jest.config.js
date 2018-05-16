module.exports = {
    "roots": [
        "<rootDir>/src/"
    ],
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
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
        "^.+\\.js$": "babel-jest"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!@ngrx|angular2-ui-switch|ng-dynamic|ngx-webstorage)"
    ]
};