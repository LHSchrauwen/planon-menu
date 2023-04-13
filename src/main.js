//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    document.querySelector('.build-button').addEventListener('click', () => {
        triggerBuild();
    });

        function triggerBuild() {
            vscode.postMessage({ command: 'build'});
        }
    
}());