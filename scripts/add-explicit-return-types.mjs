import { Node, Project, SyntaxKind, TypeFormatFlags } from 'ts-morph';

const project = new Project({
    tsConfigFilePath: 'tsconfig.app.json',
    skipAddingFilesFromTsConfig: false
});

const sourceFiles = project.getSourceFiles('src/**/*.{ts,tsx}');

let updatedFunctions = 0;

const toReturnTypeText = node => {
    const inferred = node
        .getReturnType()
        .getText(
            node,
            TypeFormatFlags.NoTruncation |
                TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
                TypeFormatFlags.WriteTypeArgumentsOfSignature
        );

    if (inferred === 'any') {
        return 'unknown';
    }

    return inferred;
};

for (const sourceFile of sourceFiles) {
    const functionLikes = sourceFile
        .getDescendantsOfKind(SyntaxKind.ArrowFunction)
        .concat(sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration))
        .concat(sourceFile.getDescendantsOfKind(SyntaxKind.FunctionExpression))
        .concat(sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration));

    for (const fn of functionLikes) {
        if (fn.getReturnTypeNode()) {
            continue;
        }

        if (Node.isFunctionDeclaration(fn) && !fn.getName()) {
            continue;
        }

        try {
            fn.setReturnType(toReturnTypeText(fn));
            updatedFunctions += 1;
        } catch {
            // ignore nodes that cannot be updated safely
        }
    }
}

await project.save();

console.log(`Updated functions: ${updatedFunctions}`);
