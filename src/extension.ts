// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';


interface CreateFileCallback {
    (dirPath: string): void;
}

interface CreateContentCallback {
    (name: string): string;
}


const formattedNameClass = (name: String) => {
    return name.toLowerCase().replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()).replace(' ', ''); 
};

const _registerCommand = (createFileCallback: CreateFileCallback) => (resource: vscode.Uri) => {
    let folderPath: string;
    try {
        const folderName: string = path.basename(resource.fsPath, path.extname(resource.fsPath));
        folderPath = path.dirname(`${resource.fsPath}/${folderName}`);
        createFileCallback(folderPath);
    } catch (err) {
        vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false }).then((folders: vscode.Uri[] | undefined) => {
            if (folders && folders.length > 0) {
                const selectedFolder: vscode.Uri = folders[0];
                const dirPath: string = selectedFolder.fsPath;
                createFileCallback(dirPath);
            }
        });
    }
};

const createForm = (name: String) => {
    const formattedName = formattedNameClass(name); 
    return `import 'package:fform/fform.dart';

class ${formattedName}Form extends FForm {
    ${formattedName}Form();

    @override
    List<FFormField> get fields => [];

    @override
    List<FForm> get subForms => [];
}`;
};

const createField = (name: String) => {
    const formattedName = formattedNameClass(name); 
    return `import 'package:fform/fform.dart';

class ${formattedName}Exception extends FFormException {

    @override
    bool get isValid => true;
}

class ${formattedName}Field extends FFormField<dynamic, ${formattedName}Exception> {

    ${formattedName}Field(super.value);

    @override
    ${formattedName}Exception? validator(value) {
        return null;
    }
}`;
};

const createException = (name: String) => {
    const formattedName = formattedNameClass(name); 
    return `import 'package:fform/fform.dart';

class ${formattedName}Exception extends FFormException {

    @override
    bool get isValid => true;
}`;
};

export function activate(context: vscode.ExtensionContext) {
    const registerCommand = vscode.commands.registerCommand;

	const form = registerCommand('fform-flutter.createForm', _registerCommand(createFormFile));

    const field = registerCommand('fform-flutter.createField', _registerCommand(createFieldFile));

    const exception = registerCommand('fform-flutter.createException', _registerCommand(createExcepitonFile));

	context.subscriptions.push(form, field, exception);

}

const createFile = (dirPath: string, suffixFile: string, content: CreateContentCallback) => {
    vscode.window.showInputBox({ placeHolder: 'Enter the name'}).then((name) => {
        if(name) {
            const filePath = path.join(dirPath, `${name.toLowerCase()}_${suffixFile}.dart`);
            const uri = vscode.Uri.file(filePath);
            vscode.workspace.fs.writeFile(uri, new Uint8Array()).then(() => {
                vscode.window.showInformationMessage(`File ${path.basename(filePath)} created successfully in ${dirPath}!`);
                vscode.workspace.openTextDocument(uri).then((document) => {
                    const edit = new vscode.WorkspaceEdit();
                    edit.insert(uri, new vscode.Position(0, 0), content(name));
                    return vscode.workspace.applyEdit(edit);
                }).then((success) => {
                    if (success) {
                        vscode.window.showInformationMessage('Text inserted successfully!');
                    } else {
                        vscode.window.showErrorMessage('Failed to insert text.');
                    }
                });
            });
        }
    });
};

const createFieldFile = (dirPath: string) => createFile(dirPath, 'field', createField);

const createFormFile = (dirPath: string) => createFile(dirPath, 'form', createForm);

const createExcepitonFile = (dirPath: string) => createFile(dirPath, 'exception', createException);

// This method is called when your extension is deactivated
export function deactivate() {}
