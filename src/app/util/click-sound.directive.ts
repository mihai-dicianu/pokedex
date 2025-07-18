
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[clickSound]'
})
export class ClickSoundDirective {
  private static audio: HTMLAudioElement = new Audio('assets/click.mp3');

  @HostListener('click')
  onClick(): void {
    ClickSoundDirective.audio.currentTime = 0;
    ClickSoundDirective.audio.play().catch(() => {
      // Silently handle audio play failures
    });
  }
}