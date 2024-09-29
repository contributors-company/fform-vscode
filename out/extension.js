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
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const formattedNameClass = (name) => {
    return name.toLowerCase().replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()).replace(' ', '');
};
const _registerCommand = (createFileCallback) => (resource) => {
    let folderPath;
    try {
        const folderName = path.basename(resource.fsPath, path.extname(resource.fsPath));
        folderPath = path.dirname(`${resource.fsPath}/${folderName}`);
        createFileCallback(folderPath);
    }
    catch (err) {
        vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false }).then((folders) => {
            if (folders && folders.length > 0) {
                const selectedFolder = folders[0];
                const dirPath = selectedFolder.fsPath;
                createFileCallback(dirPath);
            }
        });
    }
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
const createException = (name) => {
    const formattedName = formattedNameClass(name);
    return `import 'package:fform/fform.dart';

class ${formattedName}Exception extends FFormException {

    @override
    bool get isValid => true;
}`;
};
function activate(context) {
    const registerCommand = vscode.commands.registerCommand;
    const form = registerCommand('fform-flutter.createForm', _registerCommand(createFormFile));
    const field = registerCommand('fform-flutter.createField', _registerCommand(createFieldFile));
    const exception = registerCommand('fform-flutter.createException', _registerCommand(createExcepitonFile));
    context.subscriptions.push(form, field, exception);
}
const createFile = (dirPath, suffixFile, content) => {
    vscode.window.showInputBox({ placeHolder: 'Enter the name' }).then((name) => {
        if (name) {
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
                    }
                    else {
                        vscode.window.showErrorMessage('Failed to insert text.');
                    }
                });
            });
        }
    });
};
const createFieldFile = (dirPath) => createFile(dirPath, 'field', createField);
const createFormFile = (dirPath) => createFile(dirPath, 'form', createForm);
const createExcepitonFile = (dirPath) => createFile(dirPath, 'exception', createException);
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map