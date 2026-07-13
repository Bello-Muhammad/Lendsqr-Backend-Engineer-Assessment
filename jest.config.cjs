module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: {
                    module: "commonjs",
                    target: "ES2022",
                    moduleResolution: "node",
                    esModuleInterop: true,
                    allowJs: true,
                    verbatimModuleSyntax: false,
                    isolatedModules: false
                }
            }
        ]
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    testMatch: ["**/src/tests/**/*.test.ts"]
};
