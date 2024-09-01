import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { parseOsuDB, parseScoresDB } from '../db-parser/db-parser.component';
import { Chart, ChartDataset, registerables  } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-pp-graph',
  templateUrl: './pp-graph.component.html',
  styleUrl: './pp-graph.component.scss'
})
export class PpGraphComponent {
  enterUserInfromation = this._formBuilder.group({
    enterUserInfromation: ['', Validators.required],
  });
  selectOsuFolder = this._formBuilder.group({
    selectOsuFolder: ['', Validators.required],
  });
  result = this._formBuilder.group({
    result: ['', Validators.required],
  });

  osuDBSelected: boolean = false;
  scoresDBSelected: boolean = false;
  beatmap_info_retrieved: boolean = false;
  scores_calculated: boolean = false;
  simulated: boolean = false;
  selectedBestPerformanceDate: boolean = false;
  reloaded: boolean = false;

  beatmap_info_loaded: number = 0;
  beatmap_info_count: number = 0;

  usernames: any = [];

  scores: any = null;
  beatmaps: any = null;
  songs: any = null;
  beatmap_info: any = null;

  songs_loaded: number = 0;
  songs_count: number = 0;

  score_datas: any = null;

  ranked_status: any = [ "unknown", "unsubmitted", "unranked", "unused", "ranked", "approved", "qualified", "loved" ];
  mods: any = { "no_mod": 0, "no_fail": 1, "easy": 2, "touch_device": 4, "hidden": 8, "hard_rock": 16, "sudden_death": 32, "double_time": 64, "relax": 128, "half_time": 256, "nightcore": 512, "flashlight": 1024, "autoplay": 2048, "spun_out": 4096, "auto_pilot": 8192, "perfect": 16384, "key4": 32768, "key5": 65536, "key6": 131072, "key7": 262144, "key8": 524288, "fade_in": 1048576, "random": 2097152, "cinema": 4194304, "target_practice": 8388608, "key9": 16777216, "coop": 33554432, "key1": 67108864, "key3": 134217728, "key2": 268435456, "score_v2": 536870912, "mirror": 1073741824 };
  mod_abbrs: any = { "no_mod": "NM", "no_fail": "NF", "easy": "EZ", "touch_device": "TD", "hidden": "HD", "hard_rock": "HR", "sudden_death": "SD", "double_time": "DT", "relax": "RL", "half_time": "HT", "nightcore": "NC", "flashlight": "FL", "autoplay": "AP", "spun_out": "SO", "auto_pilot": "AP", "perfect": "PF", "key4": "4K", "key5": "5K", "key6": "6K", "key7": "7K", "key8": "8K", "fade_in": "FI", "random": "RD", "cinema": "CM", "target_practice": "TP", "key9": "9K", "coop": "CO", "key1": "1K", "key3": "3K", "key2": "2K", "score_v2": "V2", "mirror": "MR" };

  plot_day: any = [];

  key_counts = [0, 4, 5, 6, 7];
  key_count_names = ['Overall', '4K', '5K', '6K', '7K'];
  key_count_colors = ['#E9E0E4', '#EB3636', '#EBEB36', '#A536EB', '#36A2EB'];

  plot_performances: any = {};
  plot_best_performances: any = {};
  histories: any = {};

  best_performance_name: string = '';
  best_performance_time: string = '';
  best_performance: any = [];

  ngOnInit(): void {

    this.resetPlots();

    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.loadLast();
  }

  resetPlots() {
    this.plot_day = [];
    this.key_counts.forEach(key_count => {
      this.plot_performances[key_count] = [];
      this.plot_best_performances[key_count] = [];
      this.histories[key_count] = [];
    });
  }

  updateUsernames() {
    let usernames = this.enterUserInfromation.value.enterUserInfromation;
    if (usernames != undefined){
      this.usernames = usernames.split(',').map(item => item.trim());
      this.saveLast();
    }
  }

  trackByUsername(index: number, username: string): string {
    return username;
  }

  onScoresDBSelected(event: any) {
    const files: FileList = event.target.files;

    if (files.length === 0) return;

    let scoresDBArrayBuffer: ArrayBuffer | undefined;
    let osuDBArrayBuffer: ArrayBuffer | undefined;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;
      if (fileName === 'osu!.db') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result instanceof ArrayBuffer) {
            osuDBArrayBuffer = event.target.result;
            this.beatmaps = parseOsuDB(osuDBArrayBuffer);
            this.osuDBSelected = true;
            if (this.scoresDBSelected)
              this.getBeatmapInfo();
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (fileName === 'scores.db') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result instanceof ArrayBuffer) {
            scoresDBArrayBuffer = event.target.result;
            this.scores = parseScoresDB(scoresDBArrayBuffer);
            this.scoresDBSelected = true;
            if (this.osuDBSelected)
              this.getBeatmapInfo();
          }
        };
        reader.readAsArrayBuffer(file);
        break;
      }
    }
  }

  // onOsuFolderSelected(event: any) {
  //   const files: FileList = event.target.files;

  //   if (files.length === 0)
  //     return;

  //   const firstFilePath = files[0].webkitRelativePath || files[0].name;
  //   const topLevelFolder = firstFilePath.split('/')[0];

  //   if (topLevelFolder !== 'osu!')
  //     return;

  //   let osuDBArrayBuffer: ArrayBuffer | undefined;
  //   let scoresDBArrayBuffer: ArrayBuffer | undefined;
  //   const songsFolder: { [key: string]: File } = {};

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const filePath = file.webkitRelativePath || file.name;
  //     if (filePath === 'osu!/osu!.db') {
  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //         if (event.target?.result instanceof ArrayBuffer) {
  //           osuDBArrayBuffer = event.target.result;
  //           this.beatmaps = parseOsuDB(osuDBArrayBuffer);
  //           this.osuDBSelected = true;
  //           if (this.scoresDBSelected && this.songsFolderSelected)
  //             this.getBeatmapDiffs();
  //         }
  //       };
  //       reader.readAsArrayBuffer(file);
  //     } else if (filePath === 'osu!/scores.db') {
  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //         if (event.target?.result instanceof ArrayBuffer) {
  //           scoresDBArrayBuffer = event.target.result;
  //           this.scores = parseScoresDB(scoresDBArrayBuffer);
  //           this.scoresDBSelected = true;
  //           if (this.osuDBSelected && this.songsFolderSelected)
  //             this.getBeatmapDiffs();
  //         }
  //       };
  //       reader.readAsArrayBuffer(file);
  //     } else if (filePath.startsWith('osu!/Songs/') && file.name.endsWith('.osu')) {
  //       songsFolder[filePath] = file;
  //     }
  //   }

  //   this.songs = {};
  //   const songsFolderSize = Object.keys(songsFolder).length;
  //   let i = 1;
  //   for (const key in songsFolder) {
  //     this.readFile(songsFolder[key], key, i, songsFolderSize);
  //     i += 1;
  //   }
  // }

  // readFile(file: File, path: string, i: number, size: number) {
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     const fileContent = e.target?.result;
  //     this.songs[path] = fileContent;
  //     this.songs_loaded = i;
  //     this.songs_count = size;
  //     if (i == size) {
  //       this.songsFolderSelected = true;
  //       if (this.osuDBSelected && this.scoresDBSelected)
  //         this.getBeatmapDiffs();
  //     }
  //   };

  //   reader.readAsText(file);
  // }

  getBeatmapInfo() {
    let beatmaps: any = this.beatmaps['beatmaps'];
    let beatmap_hashes: any = [];

    for (let beatmap_hash in beatmaps)
    {
      let beatmap: any = beatmaps[beatmap_hash]
      if (this.ranked_status[beatmap['ranked']] == 'ranked' && beatmap['mode'] == 3) {
        beatmap_hashes.push(beatmap['file_md5']);
      }
    }
    this.beatmap_info_count = beatmap_hashes.length;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let url = 'https://api-osume.antocrasher.com/v1/beatmap/info';

    if (window.location.host == 'localhost:4200')
      url = 'http://localhost:80/v1/beatmap/info';

    this.http.post(url, { 'hashes': beatmap_hashes }, { headers }).subscribe((ret: any) => {
      this.beatmap_info = ret;
      this.beatmap_info_loaded = Object.keys(ret).length;
      this.beatmap_info_retrieved = true;
      this.calculateScoresPP();
    });
  }

  customAccuracy(n0: number, n50: number, n100: number, n200: number, n300: number, n320: number) {
    let total_hits = n0 + n50 + n100 + n200 + n300 + n320;
    if (total_hits == 0)
      return 0;

    return (n320 * 320.0 + n300 * 300.0 + n200 * 200.0 + n100 * 100.0 + n50 * 50.0) / (total_hits * 320.0);
  }

  calculatePP(n0: number, n50: number, n100: number, n200: number, n300: number, n320: number, beatmap_sr: number) {
    let total_hits = n0 + n50 + n100 + n200 + n300 + n320;

    return Math.pow(Math.max(beatmap_sr - 0.15, 0.05), 2.2)
    * Math.max(0.0, 5.0 * this.customAccuracy(n0, n50, n100, n200, n300, n320) - 4.0)
    * (1.0 + 0.1 * Math.min(1.0, total_hits / 1500)) * 8.0;
  }

  calculateScoresPP() {
    let beatmaps: any = this.beatmaps['beatmaps'];

    let score_beatmap_count: number = this.scores['num_beatmaps'];
    let score_beatmaps: any = this.scores['beatmaps'];

    let score_datas: any = [];

    for (let beatmap_index = 0; beatmap_index < score_beatmap_count; beatmap_index += 1) {
      let score_beatmap: any = score_beatmaps[beatmap_index]
      let score_beatmap_hash: any = score_beatmap['file_md5']

      let scores: any = score_beatmap['scores'];
      if (!(score_beatmap_hash in beatmaps))
          continue
      let beatmap = beatmaps[score_beatmap_hash];

      let score_index: any;
      for (score_index in scores) {
        let score = scores[score_index];

        let skip = true;
        this.usernames.forEach((user: any) => {
          if (user == score['player'])
            skip = false;
        });
        if (skip)
          continue;

        if (score['mode'] != 3)
          continue;

        let beatmap_hash: string = beatmap['file_md5'];

        if (!(beatmap_hash in this.beatmap_info))
          continue;

        let beatmap_name: string = beatmap['song_title'];
        let beatmap_id: number = beatmap['beatmap_id'];
        let beatmapset_id: number = beatmap['set_id'];
        let beatmap_artist: string = beatmap['artist_name'];
        let beatmap_diff: string = beatmap['version'];
        let beatmap_keycount: number = parseInt(beatmap['diff_size']);
        let beatmap_path: string = 'Songs/' + beatmap['folder_name'] + '/';
        let beatmap_osu_path: string = beatmap_path + beatmap['osu_file'];
        let beatmap_ranked_status_id = beatmap['ranked'];
        let beatmap_ranked_status = this.ranked_status[beatmap_ranked_status_id];

        if (beatmap_ranked_status != 'ranked')
          continue;

        let score_mods: any = score['mods'];

        let mods_bwc: number = 0;
        let mod_list: any = [];
        let speed_mod = 0;
        for (let mod in score_mods) {
          if (score_mods[mod]) {
            mods_bwc += this.mods[mod];
            if (mod in this.mod_abbrs) {
              let abr_mod = this.mod_abbrs[mod];
              mod_list.push(abr_mod)
              if (abr_mod == 'HT')
                speed_mod = 256;
              if (abr_mod == 'DT')
                speed_mod = 64;
            }
          }
        }

        let n0: number = score['num_miss'];
        let n50: number = score['num_50'];
        let n100: number = score['num_100'];
        let n200: number = score['num_katu'];
        let n300: number = score['num_300'];
        let n320: number = score['num_geki'];

        if (n320 + n300 + n200 + n100 + n50 + n0 < beatmap['num_hitcircles'] + beatmap['num_sliders'])
          continue;

        let beatmap_sr = this.beatmap_info[beatmap_hash]['sr'][speed_mod];
        let score_pp = this.calculatePP(n0, n50, n100, n200, n300, n320, beatmap_sr);

        let ranked_timestamp = this.beatmap_info[beatmap_hash]['ranked_timestamp']

        let score_accuracy = score['accuracy'] * 100;
        let score_timestamp = score['timestamp'];
        let score_diff_name = beatmap_diff;
        let score_score = score['score'];
        let score_max_combo = score['max_combo'];
        let score_grade = score['grade'];
        let score_grade_name =  score['grade'];

        if (ranked_timestamp > score_timestamp)
          continue

        if ('HD' in mod_list || 'FL' in mod_list) {
          if (score_grade_name[0] == 'S') {
            score_grade_name += 'H';
          }
        }

        if (!score_diff_name.toLowerCase().includes(`${beatmap_keycount}k`)) {
          score_diff_name = `[${beatmap_keycount}K] ${score_diff_name}`;
        }

        let score_data = {
          'hash': beatmap_hash,
          'beatmap_id': beatmap_id,
          'beatmapset_id': beatmapset_id,
          'title': beatmap_name,
          'artist': beatmap_artist,
          'difficulty': score_diff_name,
          'key_count': beatmap_keycount,
          'score': score_score,
          'score_id': score['score_id'],
          'player': score['player'],
          'max_combo': score_max_combo,
          'n320': n320,
          'n300': n300,
          'n200': n200,
          'n100': n100,
          'n50': n50,
          'n0': n0,
          'ranked': beatmap_ranked_status,
          'timestamp': score_timestamp,
          'mods': mod_list,
          'accuracy': score_accuracy,
          'grade': score_grade,
          'grade_name': score_grade_name,
          'performance': score_pp,
          'star_rating': beatmap_sr
        };

        score_datas.push(score_data);
      }
    }
    score_datas.sort((a: any, b: any) => a['timestamp'] - b['timestamp']);
    this.score_datas = score_datas;
    this.scores_calculated = true;

    this.simulate();
  }

  async simulate() {
    this.resetPlots();

    let unranked_mods = ['TD', 'HR', 'RL', 'AP', 'SO', '4K', '5K', '6K', '7K', '8K', 'RD', 'CM', 'TP', '9K', 'CO', '1K', '3K', '2K', 'V2'];
    let pp_mods = ['EZ', 'HT', 'DT'];

    let best_performances: any = {};
    let best_performance_lists: any = [];
    let histories: any = {};
    let score_counts: any = {};
    let performance_points: any = {};

    let timestamps_days: any = {};
    let timestamps_histories: any = {};

    this.key_counts.forEach(key_count => {
      best_performances[key_count] = {};
      best_performance_lists[key_count] = [];
      histories[key_count] = {};
      score_counts[key_count] = 0;

      performance_points[key_count] = 0;

      timestamps_days[key_count] = {};
      timestamps_histories[key_count] = {};
    });

    for (let score_index = 0; score_index < this.score_datas.length; score_index++) {
      let score = this.score_datas[score_index];

      if (score['ranked'] != 'ranked')
        continue;

      let unranked = false;
      score['mods'].forEach((mod: any) => {
        if (mod in unranked_mods)
          unranked = true;
      });
      if (unranked) {
        continue;
      }

      let map_hash = score['hash'];

      this.key_counts.forEach(key_count => {
        if (score['key_count'] == key_count || key_count == 0) {
          if (map_hash in best_performances[key_count]) {
            let check_old = pp_mods.filter(mod => best_performances[key_count][map_hash].mods.includes(mod));
            let check_new = pp_mods.filter(mod => score.mods.includes(mod));

            if (check_new.length === check_old.length && check_new.every((value, index) => value === check_old[index])) {
              if (best_performances[key_count][map_hash]['score'] < score['score']) {
                best_performances[key_count][map_hash] = score;
              }
            } else {
              if (best_performances[key_count][map_hash]['performance'] < score['performance']) {
                best_performances[key_count][map_hash] = score;
              }
            }
          } else {
            best_performances[key_count][map_hash] = score;
            score_counts[key_count] += 1;
          }
        }
      });

      this.key_counts.forEach(key_count => {
        best_performance_lists[key_count] = Object.values(best_performances[key_count]).sort((a: any, b: any) => b['performance'] - a['performance']).slice(0, 100);
        performance_points[key_count] = (417 - 1/3) * (1 - 0.995 ** Math.min(1000, score_counts[key_count]));

        for (let i = 0; i < best_performance_lists[key_count].length; i++) {
          performance_points[key_count] += 0.95 ** i * best_performance_lists[key_count][i]['performance'];
        }

        histories[key_count][score['timestamp']] = {
          'best_performance': best_performance_lists[key_count],
          'performance': performance_points[key_count]
        };
      });
    }

    this.key_counts.forEach(key_count => {
      Object.keys(histories[key_count]).forEach(timestamp => {
        let ts = Number(timestamp)
        let timestamp_zero_second = ts - ts % 86400;

        timestamps_days[key_count][timestamp_zero_second] = timestamp;
        timestamps_histories[key_count][timestamp_zero_second] = histories[key_count][timestamp];
      });

      for (let timestamp_zero_second in timestamps_days[key_count]) {
        if (key_count == 0)
          this.plot_day.push(Number(timestamp_zero_second));

        this.plot_performances[key_count].push(timestamps_histories[key_count][timestamp_zero_second]['performance']);
        this.plot_best_performances[key_count].push(timestamps_histories[key_count][timestamp_zero_second]['best_performance']);
      }

      this.histories[key_count] = timestamps_histories[key_count];
    });

    this.simulated = true;
    let keys = Object.keys(this.histories[0]);
    this.best_performance = this.histories[0][keys[keys.length-1]]['best_performance'];
    this.best_performance_name = this.key_count_names[0];
    this.best_performance_time = this.getDateFromTimestamp(this.plot_day[keys.length-1]);
    this.selectedBestPerformanceDate = true;
    this.savePlots();
    this.createChart();
  }

  savePlots() {
    localStorage.setItem('plot_day', JSON.stringify(this.plot_day));
    this.key_counts.forEach(key_count => {
      localStorage.setItem(`plot_performance_${key_count}k`, JSON.stringify(this.plot_performances[key_count]));
    });
    localStorage.setItem('usernames', JSON.stringify(this.usernames));
  }

  loadPlots() {
    const saved_plot_day = localStorage.getItem('plot_day');
    const saved_plot_performances: any = {};
    this.key_counts.forEach(key_count => {
      saved_plot_performances[key_count] = localStorage.getItem(`plot_performance_${key_count}k`);
    });
    const saved_plot_best_usernames = localStorage.getItem('usernames');

    if (saved_plot_day) {
      this.plot_day = JSON.parse(saved_plot_day);
    }
    this.key_counts.forEach(key_count => {
      if (saved_plot_performances[key_count]) {
        this.plot_performances[key_count] = JSON.parse(saved_plot_performances[key_count]);
      }
    });
    if (saved_plot_best_usernames) {
      this.usernames = JSON.parse(saved_plot_best_usernames);
      this.enterUserInfromation.controls['enterUserInfromation'].setValue(this.usernames.join(', '));
    }

    this.reloaded = true;
    this.createChart();
  }

  saveLast() {
    localStorage.setItem('usernames_last', JSON.stringify(this.usernames));
  }

  loadLast() {
    const saved_plot_usernames_last = localStorage.getItem('usernames_last');

    if (saved_plot_usernames_last) {
      this.usernames = JSON.parse(saved_plot_usernames_last);
      this.enterUserInfromation.controls['enterUserInfromation'].setValue(this.usernames.join(', '));
    }
  }

  chart: any;

  createChart(){
    if (this.chart != null) {
      this.chart.destroy()
    }


    let datasets: ChartDataset[] = [];

    for (let i = 0; i < this.key_counts.length; i++) {
      datasets.push({
        label: `${this.key_count_names[i]} PP`,
        data: this.plot_performances[this.key_counts[i]],
        borderColor: this.key_count_colors[i],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.15
      });
    }

    this.chart = new Chart('PPGraph', {
      type: 'line',
      data: {
        labels: this.plot_day,
        datasets: datasets
      },
      options: {
        responsive: true,
        elements: {
          point:{
              radius: 0
          }
        },
        plugins: {
          title: {
            display: true,
            text: `${this.usernames[0]}'s PP Over Time`,
            color: '#e9e0e4'
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
                speed: 0.1
              },
              pinch: {
                enabled: true,
              },
            },
            pan: {
              enabled: true,
              mode: 'xy'

            },
          }
        },
        onClick: (event, elements) => {
          if (elements.length) {
            if (this.simulated) {
              const chartElement = elements[0];
              const datasetIndex = chartElement.datasetIndex;
              const dataIndex = chartElement.index;
              const value = datasets[datasetIndex].data[dataIndex];
              const label = datasets[datasetIndex].label;
              if (label)
                this.best_performance_name = label;
              this.best_performance_time = this.getDateFromTimestamp(this.plot_day[dataIndex]);
              this.best_performance = this.histories[this.key_counts[datasetIndex]][this.plot_day[dataIndex]]['best_performance'];
              let score_container = document.getElementById('score-container');
              if (score_container) {
                score_container.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            type: 'time',
            time: {
              unit: 'day'
            },
            ticks: {
              autoSkip: true,
              autoSkipPadding: 50,
              color: '#e9e0e4'
            },
            grid: {
              color: "rgba(0, 0, 0, 0)",
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Performance Points',
              color: '#e9e0e4'
            },
            ticks: {
              color: '#e9e0e4'
            },
            grid: {
              color: "rgba(0, 0, 0, 0)",
            }
          }
        }
      }
    });
  }

  resetChartView() {
    if (this.chart) {
      this.chart.resetZoom();

      const xAxis = this.chart.getDatasetMeta(0).controller.getScaleForId('x');
      xAxis.options.min = undefined;
      xAxis.options.max = undefined;

      this.chart.update();
    }
  }

  getFilteredMods(mods: any): string {
    let ret = mods.filter((item: any) => item !== 'NM');
    if (ret.length > 0)
      return '+' + ret.join(', ');
    return '';
  }

  getDateFromTimestamp(timestamp: number): string {
    const date = new Date(timestamp);

    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return formattedDate + ' ' + formattedTime;
  }

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private sanitizer: DomSanitizer, private http: HttpClient) {}
}
