import { textToGradient, AppComponent, Mappack, Difficulty, getDifficultiesById, getDifficultyById, TTGParams, getMappackById } from '../app.component';
import { FormBuilder, FormControl, Validators  } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mappack-manual-clear',
  templateUrl: './mappack-manual-clear.component.html',
  styleUrl: './mappack-manual-clear.component.scss'
})
export class MappackManualClearComponent {
  selectMappackFormGroup = this._formBuilder.group({
    selectMappack: ['', Validators.required],
  });
  selectDifficultyFormGroup = this._formBuilder.group({
    selectDifficulty: ['', Validators.required],
  });
  selectDateFormGroup = this._formBuilder.group({
    selectDate: ['', Validators.required],
  });
  selectedMappack: string = '';
  selectedDifficulty: string = '';
  selectedDate: FormControl = new FormControl(new Date());

  toggleBold: boolean = true;
  toggleItalic: boolean = true;
  toggleImage: boolean = false;
  toggleVideo: boolean = false;
  toggleTitle: boolean = false;
  toggleCentered: boolean = false;

  imageURL: string = '';
  videoURL: string = '';

  inner: SafeHtml = this.sanitizer.bypassSecurityTrustHtml('');

  mappacks: Mappack[] = AppComponent.mappacks;

  getDifficulties() {
    return getDifficultiesById(this.mappacks, this.selectedMappack);
  }

  getResult() {
    let formattedDate = this.datePipe.transform(this.selectedDate.value, 'd/M/yyyy');
    let difficulty = getDifficultyById(this.mappacks, this.selectedMappack, this.selectedDifficulty);
    let mappack = getMappackById(this.mappacks, this.selectedMappack);
    if (difficulty == undefined || mappack == undefined) {
      this.inner = this.sanitizer.bypassSecurityTrustHtml(textToGradient({
        text: 'undefined ' + formattedDate, 
        mappack_name: 'undefined',
        colors: ['#555555', '#DDDDDD', '#555555', '#DDDDDD'], 
        is_bold: this.toggleBold,
        is_italic: this.toggleItalic, 
        has_image: false, 
        has_video: false,
        imageURL: '',
        videoURL: '',
        has_title: false,
        is_centered: false
      }).html);
      return ''
    }
    let result = textToGradient({
      text: difficulty.name + ' ' + formattedDate,
      mappack_name: mappack.name,
      colors: difficulty.colors,
      is_bold: this.toggleBold,
      is_italic: this.toggleItalic,
      has_image: this.toggleImage,
      has_video: this.toggleVideo,
      imageURL: this.imageURL, 
      videoURL: this.videoURL,
      has_title: this.toggleTitle,
      is_centered: this.toggleCentered
    });
    this.inner = this.sanitizer.bypassSecurityTrustHtml(result.html);
    return result.bbcode;
  }

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private sanitizer: DomSanitizer) {}
}
