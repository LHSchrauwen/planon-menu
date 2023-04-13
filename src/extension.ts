// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "planon-menu" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('planon-menu.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from planon-menu!');
		
	});
	vscode.commands.registerCommand('planon.builddeploy',() =>{
	});
	

	vscode.commands.registerCommand('planon.download',() =>{});
	vscode.commands.registerCommand('planon.unittest',() =>{});
	vscode.commands.registerCommand('planon.integrationtest',() =>{});
	
	context.subscriptions.push(disposable);

	const provider = new PlanonMenuViewProvider(context.extensionUri, context.subscriptions);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PlanonMenuViewProvider.viewType, provider));
}

// This method is called when your extension is deactivated
export function deactivate() {}
class PlanonMenuViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'planon.menu';
    
	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
		private readonly _subscriptions: any
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri,
				this._subscriptions
			]
		};
		let NEXT_TERM_ID = 1;
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
		webviewView.webview.onDidReceiveMessage(
			msg => {
				switch(msg.command){
					case 'build':
						this._subscriptions.push(vscode.commands.registerCommand('terminalTest.createAndSend', () => {
							const terminal = vscode.window.createTerminal(`Ext Terminal #${NEXT_TERM_ID++}`);
							terminal.sendText("echo 'Sent text immediately after creating'");
							terminal.show();
						}));
						vscode.commands.executeCommand('terminalTest.createAndSend');
				}
			}
		)
	}


	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview
	    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri,'src', 'main.js'));
		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
			<style>
			.build-button {background-color: #007ACC; width: 100%; color:white; border:1px; border-color:white; margin:2px;border-radius:3px;}
			h1   {color: blue;}
			p    {color: red;}
			</style>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Planon menu</title>
			</head>
			<body>
				<button class="build-button">Build ppk</button>
				<button id="demo" class="build-button">Build & Download</button>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}