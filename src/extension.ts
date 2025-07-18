import * as vscode from "vscode";
import { ProblemWebviewProvider } from "./webview/ProblemWebViewProvider";

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

export function activate(context: vscode.ExtensionContext) {
  try {
    vscode.window.showInformationMessage("✅ Extension Activated!");

    const problemWebviewProvider = new ProblemWebviewProvider(
      context.extensionUri
    );

    const mistralKey =
      process.env.MISTRAL_API_KEY ||
      vscode.workspace
        .getConfiguration("smartCodeforcesHelper")
        .get("mistralApiKey");

    if (!mistralKey) {
      throw new Error(
        "Mistral API key not found. Please set it in VS Code settings or MISTRAL_API_KEY environment variable."
      );
    }
    const helloWorld = vscode.commands.registerCommand(
      "smart-codeforces-helper.helloWorld",
      () => {
        vscode.window.showInformationMessage(
          "Hey from Smart Codeforces Helper!"
        );
      }
    );

    const showTime = vscode.commands.registerCommand(
      "smart-codeforces-helper.getTime",
      () => {
        let dateTime = new Date();
        vscode.window.showInformationMessage("Current time : " + dateTime);
      }
    );

    const loadProblem = vscode.commands.registerCommand(
      "smart-codeforces-helper.loadProblem",
      async () => {
        try {
          const input = await vscode.window.showInputBox({
            placeHolder: "Enter the url to your problem here",
            prompt: "Please enter a valid Codeforces problem URL",
          });

          if (input) {
            await problemWebviewProvider.showProblem(input);
            vscode.window.showInformationMessage(
              `Loading problem from: ${input}`
            );
          } else {
            vscode.window.showErrorMessage("No problem URL provided");
          }
        } catch (err) {
          vscode.window.showErrorMessage(`❌ Error loading problem: ${err}`);
        }
      }
    );

    const openProblemViewer = vscode.commands.registerCommand(
      "smart-codeforces-helper.openProblemViewer",
      async () => {
        try {
          await problemWebviewProvider.showProblem();
          vscode.window.showInformationMessage(
            "Problem viewer opened with sample data"
          );
        } catch (err) {
          vscode.window.showErrorMessage(
            `❌ Error opening problem viewer: ${err}`
          );
        }
      }
    );

    context.subscriptions.push(
      helloWorld,
      showTime,
      loadProblem,
      openProblemViewer
    );
  } catch (err) {
    vscode.window.showErrorMessage(`❌ Extension failed to activate: ${err}`);
  }
}

export function deactivate() {}
