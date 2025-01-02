import type { CapacitorConfig } from '@capacitor/cli';
import { environment } from "./src/environments/environment";

const config: CapacitorConfig = {
    appId: 'com.example.app',
    appName: 'trip-tuner',
    webDir: 'dist/trip-tuner/browser',
    server: {
        url: environment.runUrl,
        cleartext: true
    },
};

const path =  "/opt/android-studio-2024.1.2/android-studio/bin/studio.sh"

export default config;
