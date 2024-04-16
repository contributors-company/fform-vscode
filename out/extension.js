"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const formattedNameClass = (name) => {
    return name.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()).replace(' ', '');
};
const createForm = (name) => {
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
const createField = (name) => {
    const formattedName = formattedNameClass(name);
    return `import 'package:fform/fform.dart';

enum ${formattedName}Error {
    empty
}

class ${formattedName}Field extends FFormField<dynamic, ${formattedName}Error> {

    ${formattedName}Field(super.value);

    @override
    ${formattedName}Error? validator(value) {
        return null;
    }
}
    
`;
};
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "fform-flutter" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableForm = vscode.commands.registerCommand('fform-flutter.createForm', (resource) => {
        var folderPath;
        try {
            const folderName = path.basename(resource.fsPath, path.extname(resource.fsPath));
            folderPath = path.dirname(`${resource.fsPath}/${folderName}`);
            createFormFile(folderPath);
        }
        catch (err) {
            vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false }).then((folders) => {
                if (folders && folders.length > 0) {
                    const selectedFolder = folders[0];
                    const dirPath = selectedFolder.fsPath;
                    createFormFile(dirPath);
                }
            });
        }
    });
    const disposableField = vscode.commands.registerCommand('fform-flutter.createField', (resource) => {
        var folderPath;
        try {
            const folderName = path.basename(resource.fsPath, path.extname(resource.fsPath));
            folderPath = path.dirname(`${resource.fsPath}/${folderName}`);
            createFieldFile(folderPath);
        }
        catch (err) {
            vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false }).then((folders) => {
                if (folders && folders.length > 0) {
                    const selectedFolder = folders[0];
                    const dirPath = selectedFolder.fsPath;
                    createFieldFile(dirPath);
                }
            });
        }
    });
    context.subscriptions.push(disposableForm, disposableField);
}
exports.activate = activate;
const createFieldFile = (dirPath) => {
    vscode.window.showInputBox({ placeHolder: 'Enter the name' }).then((name) => {
        if (name) {
            const filePath = path.join(dirPath, `${name.toLowerCase()}_field.dart`);
            const uri = vscode.Uri.file(filePath);
            vscode.workspace.fs.writeFile(uri, new Uint8Array()).then(() => {
                vscode.window.showInformationMessage(`File ${path.basename(filePath)} created successfully in ${dirPath}!`);
                vscode.workspace.openTextDocument(uri).then((document) => {
                    const edit = new vscode.WorkspaceEdit();
                    edit.insert(uri, new vscode.Position(0, 0), createField(name));
                    return vscode.workspace.applyEdit(edit);
                }).then((success) => {
                    if (success) {
                        vscode.window.showInformationMessage('Text inserted successfully!');
                    }
                    else {
                        vscode.window.showErrorMessage('Failed to insert text.');
                    }
                });
            });
        }
    });
};
const createFormFile = (dirPath) => {
    vscode.window.showInputBox({ placeHolder: 'Enter the name' }).then((name) => {
        if (name) {
            const filePath = path.join(dirPath, `${name.toLowerCase()}_form.dart`);
            const uri = vscode.Uri.file(filePath);
            vscode.workspace.fs.writeFile(uri, new Uint8Array()).then(() => {
                vscode.window.showInformationMessage(`File ${path.basename(filePath)} created successfully in ${dirPath}!`);
                vscode.workspace.openTextDocument(uri).then((document) => {
                    const edit = new vscode.WorkspaceEdit();
                    edit.insert(uri, new vscode.Position(0, 0), createForm(name));
                    return vscode.workspace.applyEdit(edit);
                }).then((success) => {
                    if (success) {
                        vscode.window.showInformationMessage('Text inserted successfully!');
                    }
                    else {
                        vscode.window.showErrorMessage('Failed to insert text.');
                    }
                });
            });
        }
    });
};
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map