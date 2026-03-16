import { UploadPanelComponent } from "../../components/_upload-panel";
import { onAppReady } from "../../utilities/_events";

type MockUploadOptions = {
    durationMs: number;
    failAtPercent?: number;
};

onAppReady(() => bootstrap());

function bootstrap(): void {
    const uploadPanel = new UploadPanelComponent();
    uploadPanel.mount(document.body);

    const startSuccessBtn = document.getElementById("startSuccessUploadBtn") as HTMLButtonElement | null;
    const startFailureBtn = document.getElementById("startFailureUploadBtn") as HTMLButtonElement | null;
    const startBatchBtn = document.getElementById("startBatchScenarioBtn") as HTMLButtonElement | null;
    const clearBtn = document.getElementById("clearUploadsBtn") as HTMLButtonElement | null;

    startSuccessBtn?.addEventListener("click", () => {
        const file = createMockFile("project-proposal.docx", 380, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        const uploadId = uploadPanel.startUpload(file);
        runMockUpload(uploadPanel, uploadId, { durationMs: 2800 });
    });

    startFailureBtn?.addEventListener("click", () => {
        const file = createMockFile("budget-2026.xlsx", 820, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        const uploadId = uploadPanel.startUpload(file);
        runMockUpload(uploadPanel, uploadId, { durationMs: 2600, failAtPercent: 62 });
    });

    startBatchBtn?.addEventListener("click", () => {
        const batch = [
            {
                file: createMockFile("roadmap-q2.docx", 230, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
                options: { durationMs: 1800 },
                delayMs: 0,
            },
            {
                file: createMockFile("team-retrospective.txt", 88, "text/plain"),
                options: { durationMs: 2200 },
                delayMs: 350,
            },
            {
                file: createMockFile("client-report.xlsx", 1300, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
                options: { durationMs: 3000, failAtPercent: 74 },
                delayMs: 700,
            },
        ];

        for (const item of batch) {
            window.setTimeout(() => {
                const uploadId = uploadPanel.startUpload(item.file);
                runMockUpload(uploadPanel, uploadId, item.options);
            }, item.delayMs);
        }
    });

    clearBtn?.addEventListener("click", () => {
        uploadPanel.clear();
    });
}

function runMockUpload(
    uploadPanel: UploadPanelComponent,
    uploadId: string,
    options: MockUploadOptions,
): void {
    const tickMs = 120;
    const totalTicks = Math.max(1, Math.ceil(options.durationMs / tickMs));
    const progressStep = 100 / totalTicks;
    let currentProgress = 0;

    const timerId = window.setInterval(() => {
        currentProgress = Math.min(100, currentProgress + progressStep);
        uploadPanel.updateProgress(uploadId, currentProgress);

        if (typeof options.failAtPercent === "number" && currentProgress >= options.failAtPercent) {
            uploadPanel.markFailed(uploadId, "Network interrupted while uploading");
            window.clearInterval(timerId);
            return;
        }

        if (currentProgress >= 100) {
            uploadPanel.markCompleted(uploadId);
            window.clearInterval(timerId);
        }
    }, tickMs);
}

function createMockFile(fileName: string, sizeKb: number, mimeType: string): File {
    const content = new Uint8Array(sizeKb * 1024);
    return new File([content], fileName, { type: mimeType });
}
