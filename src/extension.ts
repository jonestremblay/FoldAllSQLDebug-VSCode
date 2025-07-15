import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider({ language: 'sql' }, new DebugRegionFoldingProvider())
    );

    // Commande pour plier explicitement toutes les régions DEBUG
    let foldDisposable = vscode.commands.registerCommand('extension.foldallsqldebug', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'sql') {
            vscode.window.showInformationMessage('Aucun éditeur SQL actif.');
            return;
        }
        const provider = new DebugRegionFoldingProvider();
        const ranges = provider.provideFoldingRanges(editor.document) || [];
        for (const range of ranges) {
            await vscode.commands.executeCommand('editor.fold', { selectionLines: [range.start] });
        }
        vscode.window.showInformationMessage('Les sections de code DEBUG sont maintenant masquées.');
    });

    // Commande pour déplier explicitement toutes les régions DEBUG
    let unfoldDisposable = vscode.commands.registerCommand('extension.unfoldallsqldebug', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'sql') {
            vscode.window.showInformationMessage('Aucun éditeur SQL actif.');
            return;
        }
        const provider = new DebugRegionFoldingProvider();
        const ranges = provider.provideFoldingRanges(editor.document) || [];
        for (const range of ranges) {
            await vscode.commands.executeCommand('editor.unfold', { selectionLines: [range.start] });
        }
        vscode.window.showInformationMessage('Les sections de code DEBUG sont maintenant visibles.');
    });

    context.subscriptions.push(foldDisposable, unfoldDisposable);
}

class DebugRegionFoldingProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(document: vscode.TextDocument): vscode.FoldingRange[] {
        const config = vscode.workspace.getConfiguration('foldAllSQLDebug');
        const rangesConfig = config.get<{start: string, end: string}[]>('ranges') || [];
        const ranges: vscode.FoldingRange[] = [];

        for (const {start: startMarker, end: endMarker} of rangesConfig) {
            const startRegex = new RegExp(startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const endRegex = new RegExp(endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            let start: number | null = null;

            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i).text;
                if (start === null && startRegex.test(line)) {
                    start = i;
                } else if (start !== null && endRegex.test(line)) {
                    ranges.push(new vscode.FoldingRange(start, i, vscode.FoldingRangeKind.Region));
                    start = null;
                }
            }
        }
        return ranges;
    }
}

export function deactivate() {}
