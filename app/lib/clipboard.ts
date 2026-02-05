import { Platform } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

export async function copyToClipboard(text: string): Promise<void> {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    Clipboard.setString(text);
  }
}
