import { Component } from '@angular/core';

@Component({
  selector: 'app-db-parser',
  templateUrl: './db-parser.component.html',
  styleUrl: './db-parser.component.scss'
})
export class DbParserComponent {

}

class StructUnpacker {
  private static formatMap: { [key: string]: { size: number, method: string } } = {
    'b': { size: 1, method: 'getInt8' },
    'B': { size: 1, method: 'getUint8' },
    'h': { size: 2, method: 'getInt16' },
    'H': { size: 2, method: 'getUint16' },
    'i': { size: 4, method: 'getInt32' },
    'I': { size: 4, method: 'getUint32' },
    'f': { size: 4, method: 'getFloat32' },
    'd': { size: 8, method: 'getFloat64' },
    'Q': { size: 8, method: 'getBigUint64' }
  };

  static unpackFrom(format: string, buffer: ArrayBuffer, offset: number = 0): any[] {
    const dataView = new DataView(buffer);
    let pos = offset;
    const result: any[] = [];
    const regex = /(\d+)?([a-zA-Z])/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(format)) !== null) {
      const count = match[1] ? parseInt(match[1], 10) : 1;
      const char = match[2];

      if (char === 's') {
        // Handle string format
        const byteArray = new Uint8Array(buffer, pos, count);
        result.push(new TextDecoder().decode(byteArray));
        pos += count;
      } else {
        const formatDetail = this.formatMap[char];
        if (!formatDetail) {
          throw new Error(`Unsupported format character: ${char}`);
        }

        for (let i = 0; i < count; i++) {
          const value = (dataView as any)[formatDetail.method](pos, true); // true for little-endian
          result.push(value);
          pos += formatDetail.size;
        }
      }
    }

    return result;
  }
}

function parseNum(db: ArrayBuffer, offset: number, length: number): [number, number] {
  let typeMap: any = {1: 'B', 2: 'H', 4: 'I', 8: 'Q'};
  let numType: string = typeMap[length];
  let val = StructUnpacker.unpackFrom(numType, db, offset)[0];
  return [val, offset + length];
}

function parseDate(db: ArrayBuffer, offset: number): [number, number] {
  const val = StructUnpacker.unpackFrom('Q', db, offset)[0] as bigint;
  const timestamp = Number(val / BigInt(10000)) - 62135769600000 + 241202000;
  return [timestamp, offset + 8];
}

function parseFloat(db: ArrayBuffer, offset: number, length: number) {
  let typeMap: any = {4: 'f', 8: 'd'};
  let numType: string = typeMap[length];
  let val = StructUnpacker.unpackFrom(numType, db, offset)[0];
  return [val, offset + length];
}

function parseBool(db: ArrayBuffer, offset: number): [boolean, number] {
  let val = StructUnpacker.unpackFrom('b', db, offset)[0]
  if (val == 0x00)
    return [false, offset + 1]
  else
    return [true, offset + 1]
}

function parseString(db: ArrayBuffer, offset: number): [string, number] {
  let existence: any;
  try {
    existence = StructUnpacker.unpackFrom('b', db, offset)[0];
  } catch {
    console.log(db, offset);
  }

  let string: string = '';

  if (existence == 0x00) {
    return ['', offset + 1]
  } else if (existence == 0x0b) {
    let length: number = 0;
    let shift: number = 0;
    offset += 1;
    while (true) {
      let val = StructUnpacker.unpackFrom('B', db, offset)[0]
      length |= ((val & 0x7F) << shift);
      offset += 1;

      if ((val & (1 << 7)) == 0) {
          break;
      }
      shift += 7;
    }

    string = StructUnpacker.unpackFrom(`${length}s`, db, offset)[0];
    offset += length;
  }

  return [string, offset];
}

function parseMods(modFlags: number) {
  let mods = ['no_fail', 'easy', 'touch_device', 'hidden', 'hard_rock',
    'sudden_death', 'double_time', 'relax', 'half_time', 'nightcore',
    'flashlight', 'autoplay', 'spun_out', 'auto_pilot', 'perfect',
    'key4', 'key5', 'key6', 'key7', 'key8', 'fade_in', 'random',
    'cinema', 'target_practice', 'key9', 'coop', 'key1', 'key3', 'key2', 'score_v2', 'mirror'];

  let modObject: any = {}
  mods.forEach((mod, i) => {
    if ((modFlags & (1 << i)) != 0)
      modObject[mod] = true
    else
      modObject[mod] = false
  });

  return modObject
}

function parseTimingPoint(db: ArrayBuffer, offset: number) {
  let tp: any = {};
  let mpb: any;
  [mpb, offset] = parseFloat(db, offset, 8)
  tp['bpm'] = Math.round(1.0 / mpb * 1000 * 60 * 1000) / 1000;
  [tp['offset'], offset] = parseFloat(db, offset, 8);
  [tp['inherited'], offset] = parseBool(db, offset);

  tp['inherited'] = !tp['inherited'];

  return [tp, offset];
}


function parseLongBeatmap(db: ArrayBuffer, offset: number) {
  let beatmap: any = {};
  [beatmap['artist_name'], offset] = parseString(db, offset);
  [beatmap['artist_uname'], offset] = parseString(db, offset);
  [beatmap['song_title'], offset] = parseString(db, offset);
  [beatmap['song_utitle'], offset] = parseString(db, offset);
  [beatmap['creator_name'], offset] = parseString(db, offset);
  [beatmap['version'], offset] = parseString(db, offset);
  [beatmap['audio_file'], offset] = parseString(db, offset);
  [beatmap['file_md5'], offset] = parseString(db, offset);
  [beatmap['osu_file'], offset] = parseString(db, offset);
  [beatmap['ranked'], offset] = parseNum(db, offset, 1);
  [beatmap['num_hitcircles'], offset] = parseNum(db, offset, 2);
  [beatmap['num_sliders'], offset] = parseNum(db, offset, 2);
  [beatmap['num_spinners'], offset] = parseNum(db, offset, 2);
  [beatmap['last_modified'], offset] = parseDate(db, offset);
  [beatmap['diff_approach'], offset] = parseFloat(db, offset, 4);
  [beatmap['diff_size'], offset] = parseFloat(db, offset, 4);
  [beatmap['diff_drain'], offset] = parseFloat(db, offset, 4);
  [beatmap['diff_overall'], offset] = parseFloat(db, offset, 4);
  [beatmap['slider_velocity'], offset] = parseFloat(db, offset, 8);

  let difficulties: any = [];

  for (let i = 0; i < 4; i++) {
    let numPairs: any;
    [numPairs, offset] = parseNum(db, offset, 4);

    if (numPairs == 0)
      difficulties.push(0.0);

    for (let j = 0; j < numPairs; j++) {
      let aByte;
      let theInt;
      let theDouble;

      [aByte, offset] = parseNum(db, offset, 1);
      [theInt, offset] = parseNum(db, offset, 4);
      [aByte, offset] = parseNum(db, offset, 1);
      [theDouble, offset] = parseFloat(db, offset, 8);

      if (j == 0)
        difficulties.push(theDouble);
    }
  }

  [beatmap['hit_length'], offset] = parseNum(db, offset, 4);
  [beatmap['total_length'], offset] = parseNum(db, offset, 4);
  [beatmap['preview_point'], offset] = parseNum(db, offset, 4);

  let numPoints;
  [numPoints, offset] = parseNum(db, offset, 4);
  beatmap['timing_points'] = []
  for (let i = 0; i < numPoints; i++) {
    let tp;
    [tp, offset] = parseTimingPoint(db, offset);
    beatmap['timing_points'].push(tp);
  }

  [beatmap['beatmap_id'], offset] = parseNum(db, offset, 4);
  [beatmap['set_id'], offset] = parseNum(db, offset, 4);
  [beatmap['thread_id'], offset] = parseNum(db, offset, 4);

  let something;
  [something, offset] = parseNum(db, offset, 4);

  [beatmap['local_offset'], offset] = parseNum(db, offset, 2);
  [beatmap['stack_leniency'], offset] = parseFloat(db, offset, 4);
  [beatmap['mode'], offset] = parseNum(db, offset, 1);
  [beatmap['source'], offset] = parseString(db, offset);
  [beatmap['tags'], offset] = parseString(db, offset);
  [beatmap['online_offset'], offset] = parseNum(db, offset, 2);
  [beatmap['title_font'], offset] = parseString(db, offset);
  [beatmap['unplayed'], offset] = parseBool(db, offset);
  [beatmap['last_played'], offset] = parseDate(db, offset);
  [beatmap['is_osz2'], offset] = parseBool(db, offset);
  [beatmap['folder_name'], offset] = parseString(db, offset);
  [beatmap['last_checked'], offset] = parseDate(db, offset);
  [beatmap['ignore_sounds'], offset] = parseBool(db, offset);
  [beatmap['ignore_skin'], offset] = parseBool(db, offset);
  [beatmap['disable_storyboard'], offset] = parseBool(db, offset);
  [beatmap['disable_video'], offset] = parseBool(db, offset);
  [beatmap['visual_override'], offset] = parseBool(db, offset);
  [beatmap['last_modified'], offset] = parseNum(db, offset, 4);
  [beatmap['scroll_speed'], offset] = parseNum(db, offset, 1);

  let bpms = beatmap["timing_points"].filter((p: any) => !p["inherited"]).map((p: any) => p["bpm"]);

  if (bpms.length == 0)
      return [null, offset]

  beatmap['max_bpm'] = Math.max(bpms);
  beatmap['min_bpm'] = Math.min(bpms);
  beatmap['bpm'] = beatmap['timing_points'][0]['bpm']
  beatmap['difficultyrating'] = difficulties[beatmap['mode']]
  beatmap['num_objects'] = beatmap['num_hitcircles'] + beatmap['num_sliders'] + beatmap['num_spinners']

  return [beatmap, offset];
}

export function parseOsuDB(db: ArrayBuffer) {
  let offset: number = 0;
  let data: any = {};

  [data['version'], offset] = parseNum(db, offset, 4);
  [data['folder_count'], offset] = parseNum(db, offset, 4);
  [data['account_unlocked'], offset] = parseBool(db, offset);
  [data['unlock_date'], offset] = parseNum(db, offset, 8);
  [data['name'], offset] = parseString(db, offset);
  [data['num_beatmaps'], offset] = parseNum(db, offset, 4);
  data['beatmaps'] = {};

  for (let i = 0; i < data['num_beatmaps']; i++) {
    let beatmap: any;
    [beatmap, offset] = parseLongBeatmap(db, offset);
    if (beatmap == null)
        continue
    data['beatmaps'][beatmap['file_md5']] = beatmap
  }

  return data;
}

export function parseScoresDB(db: ArrayBuffer) {
  let scores: any = {};
  let offset: number = 0;
  [scores['version'], offset] = parseNum(db, offset, 4);
  [scores['num_beatmaps'], offset] = parseNum(db, offset, 4);
  scores['beatmaps'] = [];

  for (let i = 0; i < scores['num_beatmaps']; i++) {
    let beatmap: any;
    [beatmap, offset] = parseBeatmap(db, offset);
    scores['beatmaps'].push(beatmap);
  }

  return scores;
}

function parseBeatmap(db: ArrayBuffer, offset: number): [any, number] {
  let beatmap: any = {};
  [beatmap['file_md5'], offset] = parseString(db, offset);
  [beatmap['num_scores'], offset] = parseNum(db, offset, 4);
  beatmap['scores'] = [];

  for (let i = 0; i < beatmap['num_scores']; i++) {
    let score: any;
    [score, offset] = parseScore(db, offset);
    beatmap['scores'].push(score);
  }

  beatmap['scores'].sort((a: any, b: any) => b['score'] - a['score']);

  return [beatmap, offset];
}

function any(iterable: any): boolean {
  for (const element of Object.values(iterable)) {
    if (element) {
      return true;
    }
  }
  return false;
}

function parseScore(db: ArrayBuffer, offset: number): [any, number] {
  let score: any = {};
  let modFlags: number;
  let empty: string;
  let fff: number;

  [score['mode'], offset] = parseNum(db, offset, 1);
  [score['version'], offset] = parseNum(db, offset, 4);
  [score['md5'], offset] = parseString(db, offset);
  [score['player'], offset] = parseString(db, offset);
  [score['replay_md5'], offset] = parseString(db, offset);
  [score['num_300'], offset] = parseNum(db, offset, 2);
  [score['num_100'], offset] = parseNum(db, offset, 2);
  [score['num_50'], offset] = parseNum(db, offset, 2);
  [score['num_geki'], offset] = parseNum(db, offset, 2);
  [score['num_katu'], offset] = parseNum(db, offset, 2);
  [score['num_miss'], offset] = parseNum(db, offset, 2);
  score['num_hits'] = score['num_miss'] + score['num_50'] + score['num_100'] + score['num_katu'] + score['num_300'] + score['num_geki'];
  [score['score'], offset] = parseNum(db, offset, 4);
  [score['max_combo'], offset] = parseNum(db, offset, 2);
  [score['perfect_combo'], offset] = parseBool(db, offset);
  [modFlags, offset] = parseNum(db, offset, 4);
  score['mods'] = parseMods(modFlags);
  [empty, offset] = parseString(db, offset);
  [score['timestamp'], offset] = parseDate(db, offset);
  [fff, offset] = parseNum(db, offset, 4);
  [score['score_id'], offset] = parseNum(db, offset, 8);

  // no mod flag
  if (!any(score['mods'])) {
    score['mods']['no_mod'] = true
  } else {
    score['mods']['no_mod'] = false
  }

  // accuracy calculation
  let misses = score['num_miss']
  let num300 = score['num_300']
  let num100 = score['num_100']
  let num50 = score['num_50']
  let numGeki = score['num_geki']
  let numKatu = score['num_katu']

  // osu!std
  if (score['mode'] == 0) {
    let numNotes = misses + num300 + num100 + num50
    let weightedScore = num300 + num100 * 2.0 / 6.0 + num50 * 1.0 / 6.0
    score['accuracy'] = weightedScore / numNotes

    if (score['accuracy'] == 1.0)
      score['grade'] = 'SS'
    else if (num300 / numNotes >= 0.9 && num50 / numNotes <= 0.1 && misses == 0)
      score['grade'] = 'S'
    else if (num300 / numNotes >= 0.8 && misses == 0 || num300 / numNotes >= 0.9)
      score['grade'] = 'A'
    else if (num300 / numNotes >= 0.7 && misses == 0 || num300 / numNotes >= 0.8)
      score['grade'] = 'B'
    else if (num300 / numNotes >= 0.6)
      score['grade'] = 'C'
    else
      score['grade'] = 'D'
  }
  // osu!taiko
  else if (score['mode'] == 1) {
    let numNotes = misses + num300 + num100
    let weightedScore = num300 + num100 * 0.5
    score['accuracy'] = weightedScore / numNotes

    if (score['accuracy'] == 1.0)
      score['grade'] = 'SS'
    else if (num300 / numNotes >= 0.9 && misses == 0)
      score['grade'] = 'S'
    else if (num300 / numNotes >= 0.8 && misses == 0 || num300 / numNotes >= 0.9)
      score['grade'] = 'A'
    else if (num300 / numNotes >= 0.7 && misses == 0 || num300 / numNotes >= 0.8)
      score['grade'] = 'B'
    else if (num300 / numNotes >= 0.6)
      score['grade'] = 'C'
    else
      score['grade'] = 'D'
  }
  // osu!catch
  else if (score['mode'] == 2) {
    let numNotes = num300 + num100 + num50 + misses + numKatu
    let weightedScore = num300 + num100 + num50
    score['accuracy'] = weightedScore / numNotes

    if (score['accuracy'] == 1.0)
      score['grade'] = 'SS'
    else if (score['accuracy'] > .98)
      score['grade'] = 'S'
    else if (score['accuracy'] > .94)
      score['grade'] = 'A'
    else if (score['accuracy'] > .90)
      score['grade'] = 'B'
    else if (score['accuracy'] > .85)
      score['grade'] = 'C'
    else
      score['grade'] = 'D'
  }
  // osu!mania
  else if (score['mode'] == 3) {
    let numNotes = numGeki + num300 + numKatu + num100 + num50 + misses
    let weightedScore = numGeki + num300 + numKatu * 2.0 / 3.0 + num100 * 1.0 / 3.0 + num50 * 1.0 / 6.0
    score['accuracy'] = weightedScore / numNotes

    if (score['accuracy'] == 1.0)
      score['grade'] = 'SS'
    else if (score['accuracy'] > .95)
      score['grade'] = 'S'
    else if (score['accuracy'] > .90)
      score['grade'] = 'A'
    else if (score['accuracy'] > .80)
      score['grade'] = 'B'
    else if (score['accuracy'] > .70)
      score['grade'] = 'C'
    else
      score['grade'] = 'D'
  }

  return [score, offset]
}
