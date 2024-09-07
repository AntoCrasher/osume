import { textToGradient, AppComponent, Mappack, Difficulty, ClearType, getDifficultiesById, getDifficultyById, TTGParams, getMappackById, getMappackByHash } from '../app.component';
import { FormBuilder, FormControl, Validators  } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { parseScoresDB } from '../db-parser/db-parser.component'
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-mappack-auto-clear',
  templateUrl: './mappack-auto-clear.component.html',
  styleUrl: './mappack-auto-clear.component.scss'
})
export class MappackAutoClearComponent {
  selectOsuDb = this._formBuilder.group({
    selectOsuDb: ['', Validators.required],
  });

  selectedMappack: string = '';
  selectedDifficulty: string = '';
  selectedDate: FormControl = new FormControl(new Date());

  toggleBold: boolean = true;
  toggleItalic: boolean = true;
  toggleNonClear: boolean = false;
  toggleImage: boolean = false;
  toggleCentered: boolean = false;
  toggleEmojiKey: boolean = false;
  toggleAccuracy: boolean = true;

  imageURLs: any = {};
  videoURLs: any = {};
  toggleURLs: any = {};

  shownScores: any = [];

  inner: SafeHtml = this.sanitizer.bypassSecurityTrustHtml('');

  mappacks: Mappack[] = AppComponent.mappacks;

  scores: any = {'version': 0, 'num_beatmaps': 0, 'beatmaps': []};

  getDifficulties() {
    return getDifficultiesById(this.mappacks, this.selectedMappack);
  }

  timestampToDMMYYYY(timestamp: number): string {
    const date = new Date(timestamp);

    date.setDate(date.getDate());

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  ngOnInit() {
    this.loadURLs();
  }

  saveURLs() {
    localStorage.setItem('toggleURLs', JSON.stringify(this.toggleURLs));
    localStorage.setItem('imageURLs', JSON.stringify(this.imageURLs));
    localStorage.setItem('videoURLs', JSON.stringify(this.videoURLs));
  }

  loadURLs() {
    const savedToggleURLs = localStorage.getItem('toggleURLs');
    const savedImageURLs = localStorage.getItem('imageURLs');
    const savedVideoURLs = localStorage.getItem('videoURLs');
    if (savedToggleURLs) {
      this.toggleURLs = JSON.parse(savedToggleURLs);
    }
    if (savedImageURLs) {
      this.imageURLs = JSON.parse(savedImageURLs);
    }
    if (savedVideoURLs) {
      this.videoURLs = JSON.parse(savedVideoURLs);
    }
  }

  isClear(score: any, difficulty: Difficulty): boolean {
    if (difficulty.clear.mods) {
      let hasMods = true;
      difficulty.clear.mods.forEach((mod: string) => {
        if (!score['mods'][mod])
          hasMods = false;
      });
      if (!hasMods)
        return false;
    }
    if (score['num_hits'] < difficulty.hitobjects)
      return false;
    if (!(score['accuracy'] >= difficulty.clear.accuracy))
      return false;
    if (difficulty.clear.combo && !(score['combo'] >= difficulty.clear.combo))
      return false;
    if (difficulty.clear.misses && !(score['num_miss'] < difficulty.clear.misses))
      return false;
    return true;
  }

  isPass(score: any, difficulty: Difficulty): boolean {
    if (score['num_hits'] < difficulty.hitobjects)
      return false;
    return true;
  }

  initializeToggles() {
    this.shownScores.forEach((score: any) => {
      if (!(score in this.toggleURLs)) {
        this.toggleURLs[score] = true;
      }
    });
  }

  getResult() {
    this.shownScores = []
    let mappackScores: any = {}
    this.scores['beatmaps'].forEach((beatmap: any) => {
      let mappack: Mappack | null;
      let difficulty: Difficulty | null;
      let mapHash = beatmap['file_md5'];
      [mappack, difficulty] = getMappackByHash(this.mappacks, mapHash);

      if (mappack != null && difficulty != null) {
        if (!(mapHash in mappackScores)) {
          mappackScores[mapHash] = [
            mappack,
            difficulty,
            beatmap
          ];
        }
      }
    });

    let resultHTML = '';
    let resultBBcode = '';

    resultBBcode += '[notice]';

    if (this.toggleCentered) {
      resultBBcode += '[centre]';
      resultHTML += '<div style="text-align: center">\n';
    }

    resultBBcode += '\n';

    resultHTML += '<span style="color: #FFFFFF; font-size: 200%"><strong><i>~~~ DANS ~~~</i></strong><br></span><br>\n';
    resultBBcode += '[size=200][b][i]~~~ DANS ~~~[/i][/b][/size]\n';

    if (this.toggleCentered) {
      resultBBcode += '[/centre]';
      resultHTML += '</div>'
    }
    resultBBcode += '[/notice]\n';

    if (this.toggleEmojiKey) {
      resultBBcode += '[notice]';
      if (this.toggleCentered) {
        resultBBcode += '[centre]';
        resultHTML += '<div style="text-align: center">\n';
      }
      resultBBcode += '\n';

      resultHTML += '<div style="color: #FFFFFF">\n';
      resultHTML += '<span style="font-size: 150%"><strong><i>Emoji Key</i></strong><br></span>\n';
      resultHTML += '<strong>✅<i>= NM CLEAR</i></strong><br>\n';
      resultHTML += '<strong>😎<i>= NM PASS</i></strong><br>\n';
      resultHTML += '<strong>🥶<i>= HT CLEAR</i></strong><br>\n';
      resultHTML += '<strong>😭<i>= HT PASS</i></strong><br>\n';
      resultHTML += '</div><br>\n';

      resultBBcode += '[size=150][b][i]Emoji Key[/i][/b][/size]\n';
      resultBBcode += '[b]✅[i] = NM CLEAR[/i][/b]\n';
      resultBBcode += '[b]😎[i] = NM PASS[/i][/b]\n';
      resultBBcode += '[b]🥶[i] = HT CLEAR[/i][/b]\n';
      resultBBcode += '[b]😭[i] = HT PASS[/i][/b]\n';

      if (this.toggleCentered) {
        resultBBcode += '[/centre]'
        resultHTML += '</div>\n'
      }
      resultBBcode += '[/notice]\n'
    }

    this.mappacks.forEach(mappack => {
      let count = 0;
      let hasTitle = false;
      mappack.difficulties.forEach(difficulty => {
        if (difficulty.md5 in mappackScores) {
          let beatmap = mappackScores[difficulty.md5];
          let scores = beatmap[2]['scores'];
          let fullname = mappack.id + ' - ' + difficulty.id;

          let clearType: ClearType = ClearType.NONE;
          let best_score = null;

          for (let score of scores) {
            if (score['mods']['half_time'])
              continue;
            if (!this.isPass(score, difficulty))
              continue;

            if (this.isClear(score, difficulty))
              clearType = ClearType.CLEAR;
            else {
              if (clearType != ClearType.NONE){
                break;
              }
              clearType = ClearType.PASS;
            }

            if (best_score == null || best_score['timestamp'] > score['timestamp'])
              best_score = score;
          }
          if (clearType == ClearType.NONE) {
            for (let score of scores) {
              if (!score['mods']['half_time'])
                continue;
              if (!this.isPass(score, difficulty))
                continue;

              if (this.isClear(score, difficulty))
                clearType = ClearType.HTCLEAR;
              else {
                if (clearType != ClearType.NONE){
                  break;
                }
                clearType = ClearType.HTPASS;
              }

              if (best_score == null || best_score['timestamp'] > score['timestamp'])
                best_score = score;
            }
          }

          if (best_score != null) {
            if (this.toggleNonClear || clearType == ClearType.CLEAR) {
              count++;
            }
            if (count == 1 && !hasTitle) {
              resultBBcode += '[notice]';
              if (this.toggleCentered) {
                resultBBcode += '[centre]';
                resultHTML += '<div style="text-align: center">'
              }
              resultBBcode += '\n'

              resultBBcode += `[size=150][b][i]${mappack.name}[/i][/b][/size]\n`
              resultHTML += `<span style="font-size: 150%; color: white"><strong><i>${mappack.name}</i></strong></span><br><br>`
              hasTitle = true;
            }
            let suffix: string = '';
            let accuracy = (best_score['accuracy'] * 100).toFixed(2);

            if (this.toggleEmojiKey) {
              if (clearType == ClearType.CLEAR)
                suffix = `✅`
              if (clearType == ClearType.PASS)
                suffix = `😎`
              if (clearType == ClearType.HTCLEAR)
                suffix = `🥶`
              if (clearType == ClearType.HTPASS)
                suffix = `😭`
            }

            fullname += ` - (${accuracy}%)`

            let toggleURL = this.toggleURLs[fullname];
            if (!toggleURL) {
              toggleURL = true;
              this.toggleURLs[fullname] = true;
            }

            let imageURL = this.imageURLs[fullname];
            let videoURL = this.videoURLs[fullname];

            let hasImage = imageURL;
            let hasVideo = videoURL;
            if (!hasImage)
              imageURL = '';
            if (!hasVideo)
              videoURL = '';

            let comment = '';
            if (this.toggleAccuracy)
              comment = `(${accuracy}%)`;

            let result = textToGradient({
              text: difficulty.name + ' ' + this.timestampToDMMYYYY(best_score['timestamp']),
              suffix: suffix,
              comment: comment,
              mappack_name: mappack.name,
              colors: difficulty.colors,
              is_bold: this.toggleBold,
              is_italic: this.toggleItalic,
              has_image: this.toggleImage,
              has_video: hasVideo,
              closed_image: !hasImage,
              imageURL: imageURL,
              videoURL: videoURL,
              has_title: false,
              is_centered: this.toggleCentered,
            });

            if (toggleURL) {
              if (this.toggleNonClear || clearType == ClearType.CLEAR) {
                resultHTML += `${result.html}<br>`
                resultBBcode += `${result.bbcode}\n`
              }
            }
            this.shownScores.push(fullname);
          }
        }
      });
      if (count > 0) {
        resultHTML += `<br>`
        if (this.toggleCentered) {
          resultBBcode += '[/centre]'
          resultHTML += '</div>'
        }
        resultBBcode += '[/notice]\n'
      }
    });

    this.saveURLs();
    this.inner = this.sanitizer.bypassSecurityTrustHtml(resultHTML);
    return resultBBcode;
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        let scoresDB = e.target.result;
        try {
          this.scores = parseScoresDB(scoresDB);
          this.getResult();
        } catch {
          console.error('File is not score.db')
        }
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private sanitizer: DomSanitizer, private http: HttpClient) {}
}
