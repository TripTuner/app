import { Presets, SingleBar } from "cli-progress";

export function createProgressBar(total: number): SingleBar {
    // Create a new progress bar instance
    const progressBar = new SingleBar({
        format: "{bar} | {percentage}% | {value}/{total} | {eta}s remaining",
        hideCursor: true,
    }, Presets.shades_classic);

    progressBar.start(total, 1);

    return progressBar;
}