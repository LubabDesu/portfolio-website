// Jest manual mock for @octokit/rest (pure ESM, incompatible with ts-jest CJS transform).
// Only buildMarkdownFile is unit-tested — pushBlogAsPR (which uses Octokit) is
// tested end-to-end via the API route, not in the Jest suite.
const Octokit = jest.fn().mockImplementation(() => ({
    git: {
        getRef: jest.fn(),
        createRef: jest.fn(),
    },
    repos: {
        createOrUpdateFileContents: jest.fn(),
    },
    pulls: {
        create: jest.fn(),
    },
}));

module.exports = { Octokit };
