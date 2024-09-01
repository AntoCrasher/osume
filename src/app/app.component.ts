import { Component } from '@angular/core';

export interface Mappack {
  id: string
  name: string
  difficulties: Difficulty[]
}

export interface ClearCondition {
  accuracy: number
  combo?: number
  misses?: number
  mods?: string[]
}

export enum ClearType {
  NONE,
  CLEAR,
  PASS,
  HTCLEAR,
  HTPASS
}

export interface Difficulty {
  id: string
  name: string
  clear: ClearCondition
  md5: string
  hitobjects: number
  colors: string[]
}

export interface Result {
  html: string
  bbcode: string
}

export interface TTGParams {
  text: string
  suffix?: string
  comment?: string
  mappack_name: string
  colors: string[]

  is_bold: boolean
  is_italic: boolean

  has_image: boolean
  has_video: boolean
  closed_image?: boolean

  imageURL: string
  videoURL: string

  has_title: boolean
  is_centered: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  static mappacks: Mappack[] = [
    {
      id: 'reform_dan',
      name: 'Dan ~ REFORM ~ 2nd Pack',
      difficulties: [
        { id: '6th', name: '6th dan', clear: { accuracy: 0.96 }, md5: 'f7c9fbb87a804dc7f5f8f558deac71bd', hitobjects: 6286 + 31, colors: ['#D9B485', '#D9CCBD', '#D9B485'] },
        { id: '7th', name: '7th dan', clear: { accuracy: 0.96 }, md5: '8e1be66b82e1480c4ad8a4e1a297b1b8', hitobjects: 7920 + 112, colors: ['#D9B485', '#D9CCBD', '#D9B485'] },
        { id: '8th', name: '8th dan', clear: { accuracy: 0.96 }, md5: '92bba709bcc871333df46d606aaa5d48', hitobjects: 6649 + 34, colors: ['#D9B485', '#D9CCBD', '#D9B485'] },
        { id: '9th', name: '9th dan', clear: { accuracy: 0.96 }, md5: 'd25a4b3fde5bc764d259b1bac6a7671c', hitobjects: 8055 + 35, colors: ['#D9B485', '#D9CCBD', '#D9B485'] },
        { id: '10th', name: '10th dan', clear: { accuracy: 0.96 }, md5: '1e0310955d28145ca287112360d162e8', hitobjects: 7405 + 76, colors: ['#D9B485', '#D9CCBD', '#D9B485'] },
        { id: 'alpha', name: 'ALPHA α dan', clear: { accuracy: 0.96 }, md5: 'e86b3a738dd101eb4be9afffcbc5f3a8', hitobjects: 9353 + 67, colors: ['#534DC8', '#BC4D7F', '#FFB04D', '#FCFA4D'] },
        { id: 'beta', name: 'BETA β dan', clear: { accuracy: 0.96 }, md5: 'e3a43a14d982dadfd2b015b0ac641921', hitobjects: 8548 + 76, colors: ['#FF994D', '#FFFE4C', '#FF994E'] },
        { id: 'gamma', name: 'GAMMA γ dan', clear: { accuracy: 0.96 }, md5: 'e0bbf500b763e48ddc5a6f3fafacf58e', hitobjects: 9232 + 80, colors: ['#E53F64', '#633CE2', '#61D9E4', '#63E085'] },
        { id: 'delta', name: 'DELTA δ dan', clear: { accuracy: 0.96 }, md5: '6432f864b074264c230604cfe142edb0', hitobjects: 10483 + 17, colors: ['#F57601', '#9C4726', '#4C1D47', '#250A4F'] },
        { id: 'epsilon', name: 'EPSILON ε dan', clear: { accuracy: 0.96 }, md5: 'c290f7c54064a7ff3e15bc64ddfc8692', hitobjects: 9700 + 3, colors: ['#FDF1D9', '#C7245A', '#204380', '#FFEEDC'] },
        { id: 'zeta', name: 'ZETA ζ dan', clear: { accuracy: 0.96 }, md5: '4c7bf2d1db90a130b794be8573dec65a', hitobjects: 10462 + 362, colors: ['#E3785C', '#CF7AB0', '#B291C8', '#55A0C0']}
      ]
    },
    {
      id: 'manip_dan',
      name: '~ Manip ~ Dan Pack',
      difficulties: [
        { id: 'alpha', name: 'MANIP-ALPHA α', clear: { accuracy: 0.96 }, md5: 'f4808a71e90fd0ae30c9543fae2af4a3', hitobjects: 13532 + 149, colors: ['#A549E5', '#C57DA0', '#E0AA66', '#EBBD4D']},
        { id: 'beta', name: 'MANIP-BETA β', clear: { accuracy: 0.96 }, md5: 'b051cfadcb5a465594890bd4dab3459e', hitobjects: 13239 + 163, colors: ['#8CE0FF', '#AAA2F5', '#FF00DC']},
        { id: 'gamma', name: 'MANIP-GAMMA γ', clear: { accuracy: 0.96 }, md5: '2111becf01e7d1446bdaa8e2234f5d7c', hitobjects: 8296 + 66, colors: ['#7CFF81', '#90ADBE', '#A06AF2']},
        { id: 'delta', name: 'MANIP-DELTA δ', clear: { accuracy: 0.95 }, md5: '15636bb6828fef7a6bbec71146fe2af1', hitobjects: 9226 + 190, colors: ['#4A0087', '#6E156B', '#B53E36']},
        { id: 'epsilon', name: 'EXTRA-MANIPSILON ε', clear: { accuracy: 0.95, combo: 1000, misses: 85 }, md5: '2c967cc63cdbc4ccf80ff08741ccd991', hitobjects: 10359 + 426, colors: ['#CC6764', '#96849C', '#4960B5']},
        { id: 'zeta_old', name: 'EXTRA-ZETANIP ζ (old ver.)', clear: { accuracy: 0.93 }, md5: 'f314e4ea624b1cdf704bcf0cd127558a', hitobjects: 11489 + 74, colors: ['#9E5b58', '#710000', '#3F0000']},
        { id: 'zeta', name: 'EXTRA-ZETANIP ζ', clear: { accuracy: 0.94 }, md5: '3431056788a5b2956633f31b70a3fc54', hitobjects: 14184 + 47, colors: ['#A76A6B', '#7F0000', '#510000']}
      ]
    },
    {
      id: 'joker_dan',
      name: 'Chordjack Joker Dan',
      difficulties: [
        { id: 'i', name: 'I dan', clear: { accuracy: 0.96 }, md5: '1d4fb57b70fbb150232ae09470e3d93b', hitobjects: 8182 + 62, colors: ['#676767', '#8A8D8F', '#676767'] },
        { id: 'ii', name: 'II dan', clear: { accuracy: 0.96 }, md5: '18c205730ec7502ece93d360dc531247', hitobjects: 7422 + 12, colors: ['#676767', '#8A8D8F', '#676767'] },
        { id: 'iii', name: 'III dan', clear: { accuracy: 0.96 }, md5: 'd5c8e3875b27ca4e2a10aea3012aa63f', hitobjects: 8889 + 141, colors: ['#676767', '#8A8D8F', '#676767'] },
        { id: 'iv', name: 'IV dan', clear: { accuracy: 0.96 }, md5: '416c18fdc15a4ea271e72e9a583dacff', hitobjects: 8979 + 258, colors: ['#676767', '#8A8D8F', '#676767'] },
        { id: 'v', name: 'V dan', clear: { accuracy: 0.96 }, md5: '7a308f5e180c13c15e02670c7efc6f26', hitobjects: 9663 + 31, colors: ['#676767', '#8A8D8F', '#676767'] },
        { id: 'vi', name: 'VI dan', clear: { accuracy: 0.96 }, md5: 'ca0aa0c609ec6c78f1dcb006007b2b72', hitobjects: 10143 + 67, colors: ['#676767', '#8A8D8F', '#676767'] },
        { id: 'vii', name: 'VII dan', clear: { accuracy: 0.96 }, md5: 'f98c33e37ffc470861e70226a2ad8929', hitobjects: 10942 + 18, colors: ['#676767', '#8A8D8F', '#676767'] },
        { id: 'phi', name: 'PHI φ dan', clear: { accuracy: 0.96 }, md5: '3c564f21f2d6e35f8513afe266feb2b5', hitobjects: 12319 + 130, colors: ['#B73C3C', '#F05656', '#B73C3C'] },
        { id: 'chi', name: 'CHI χ dan', clear: { accuracy: 0.96 }, md5: 'b8bd20d132ef3d7879a252daddbb8785', hitobjects: 12641 + 115, colors: ['#2659DA', '#2E66F2', '#2659DA'] },
        { id: 'psi', name: 'PSI ψ dan', clear: { accuracy: 0.96 }, md5: '48dda2d4534f2a3002181538a4874160', hitobjects: 13065 + 98, colors: ['#523164', '#8535B3', '#523164'] },
        { id: 'omega', name: 'OMEGA Ω dan', clear: { accuracy: 0.96 }, md5: '17f635511f487219363783af0480d033', hitobjects: 13957 + 69, colors: ['#313231', '#575858', '#313231'] }
      ]
    },
    {
      id: '7k_regular_dan',
      name: '7K Regular Dan',
      difficulties: [
        { id: '0th', name: '0th dan', clear: { accuracy: 0.96 }, md5: '403ddeb24d4deeecc75a09942640401e', hitobjects: 4108 + 7, colors: ['#7A98DB', '#4C4C4C', '#8F9297', '#1ED4E9'] },
        { id: '1st', name: '1st dan', clear: { accuracy: 0.96 }, md5: 'd2dde2e1cdfb0fdeaa975aea4ae33e42', hitobjects: 6179 + 56, colors: ['#A83C3C', '#7C7C8B', '#E68229', '#152FCE'] },
        { id: '2nd', name: '2nd dan', clear: { accuracy: 0.96 }, md5: 'f33d7c8df46e579996951e63746c3217', hitobjects: 6709 + 91, colors: ['#C96206', '#727F9E', '#A16DE9', '#1AE963'] },
        { id: '3rd', name: '3rd dan', clear: { accuracy: 0.96 }, md5: 'b2deac5abe831acc34b4cb053f1949a1', hitobjects: 7696 + 33, colors: ['#AE6AD9', '#7A92CF', '#3D9D73', '#5C6069'] },
        { id: '4th', name: '4th dan', clear: { accuracy: 0.96 }, md5: '6ef18aaf72c4f71756b0da87f7a289bc', hitobjects: 8414 + 0, colors: ['#282728', '#9699A2', '#A60000', '#715EC4'] },
        { id: '5th', name: '5th dan', clear: { accuracy: 0.96 }, md5: 'f198256f6da1b0a95f8e267196333045', hitobjects: 8620 + 0, colors: ['#1E6339', '#5C5E62', '#C2340E', '#0B2464'] },
        { id: '6th', name: '6th dan', clear: { accuracy: 0.96 }, md5: 'e0f009741295dc2912d6991f15e3fa43', hitobjects: 9765 + 0, colors: ['#6E6E6E', '#3E90A5', '#EE4B12', '#9A61C1'] },
        { id: '7th', name: '7th dan', clear: { accuracy: 0.96 }, md5: 'a0c3d30d75911706ef371d5bec636de3', hitobjects: 10350 + 0, colors: ['#6B0B97', '#AA0808', '#D23903', '#5EA8D7'] },
        { id: '8th', name: '8th dan', clear: { accuracy: 0.96 }, md5: 'c7040fa644b4649be60f1586e37fe1fa', hitobjects: 10633 + 2, colors: ['#491DA4', '#9A9935', '#E3498A', '#2EAC40'] },
        { id: '9th', name: '9th dan', clear: { accuracy: 0.96 }, md5: '4bddef566f968374652f4ec365179435', hitobjects: 10768 + 1, colors: ['#5E71A3', '#D2738A', '#5FC0EE', '#B07E36'] },
        { id: '10th', name: '10th dan', clear: { accuracy: 0.96 }, md5: '71bb06db9d7acb6381aee08cb32d6d74', hitobjects: 11395 + 1, colors: ['#00C8FF', '#FF7BBF', '#5FC0EE', '#BA0605'] },
        { id: 'gamma', name: 'GAMMA γ dan', clear: { accuracy: 0.96 }, md5: '22c436600e746a04e7ede85765f382c8', hitobjects: 11999 + 4, colors: ['#5902B6', '#A7A7A7', '#004400', '#002943'] },
        { id: 'azimuth', name: 'AZIMUTH ψ dan', clear: { accuracy: 0.96 }, md5: 'c9927b9b467c5958994ad215abb60609', hitobjects: 14209 + 10, colors: ['#009887', '#FF491B', '#FF0000', '#66ACD0'] },
        { id: 'zenith', name: 'ZENITH ζ dan', clear: { accuracy: 0.96 }, md5: '90492cfc1244bb1db82bba87eafe9cda', hitobjects: 14573 + 5, colors: ['#315175', '#010101', '#861649', '#00008B'] },
        { id: 'stellium', name: 'STELLIUM ★ dan', clear: { accuracy: 0.96 }, md5: '1d04cb7d4aa644cbf89be37a8bc02b18', hitobjects: 16383 + 1, colors: ['#48294D', '#000001', '#771705', '#D35A00'] }
      ]
    },
    {
      id: '7k_ln_dan',
      name: '7K LN Dan',
      difficulties: [
        { id: '0th', name: '0th dan', clear: { accuracy: 0.95 }, md5: '04f95ed271f790090e53dbe7eff50dbd', hitobjects: 941 + 941, colors: ['#CA73CF', '#68C6E1', '#EF18B5', '#0D3BE7'] },
        { id: '1st', name: '1st dan', clear: { accuracy: 0.95 }, md5: 'd362b5025667785becb1dbd18e55a963', hitobjects: 993 + 1722, colors: ['#D0A873', '#0E82A4', '#1D3A8E', '#DD6DCF'] },
        { id: '2nd', name: '2nd dan', clear: { accuracy: 0.95 }, md5: 'f80fc0aa5c1ea84faf8919874f37be86', hitobjects: 1901 + 2520, colors: ['#7763B6', '#D30762', '#E9B321', '#0E8392'] },
        { id: '3rd', name: '3rd dan', clear: { accuracy: 0.95 }, md5: '1052047a32fa9cc8d4105723e330ada0', hitobjects: 1469 + 2615, colors: ['#3A6ED9', '#001D88', '#11003D', '#AEAE95'] },
        { id: '4th', name: '4th dan', clear: { accuracy: 0.95 }, md5: '173928678c78d1fa6cff5d8ca2c07169', hitobjects: 904 + 3202, colors: ['#C99E09', '#B32251', '#E889EC', '#838249'] },
        { id: '5th', name: '5th dan', clear: { accuracy: 0.95 }, md5: 'c84c3b7ace5d36c587c269aab33a0c1c', hitobjects: 1218 + 4213, colors: ['#E4CE83', '#CB7E0F', '#1923DE', '#081145'] },
        { id: '6th', name: '6th dan', clear: { accuracy: 0.95 }, md5: '8aea034ea3f511394c36dcb7adb5ea9c', hitobjects: 861 + 4513, colors: ['#2FB8D5', '#12BB41', '#9E2338', '#CEC49F'] },
        { id: '7th', name: '7th dan', clear: { accuracy: 0.95 }, md5: 'a90a6084127cb966436c1a78e5a5bc7f', hitobjects: 969 + 5670, colors: ['#4A4889', '#CD4241', '#74A745', '#BFAAA5'] },
        { id: '8th', name: '8th dan', clear: { accuracy: 0.95 }, md5: '58d31463a6ff83551d7571b1e63acba6', hitobjects: 991 + 6202, colors: ['#DECAC9', '#974B2F', '#804FB8', '#0C275C'] },
        { id: '9th', name: '9th dan', clear: { accuracy: 0.95 }, md5: '09546ec514f9fa60549a4e08478582a6', hitobjects: 333 + 7000, colors: ['#B75C30', '#081E3A', '#D16F04', '#3C514C'] },
        { id: '10th', name: '10th dan', clear: { accuracy: 0.95 }, md5: '95862ed585b86ccf0a2dd2b0298f19aa', hitobjects: 225 + 7975, colors: ['#0A5453', '#93171C', '#1C122C', '#B093AB'] },
        { id: 'gamma', name: 'GAMMA γ dan', clear: { accuracy: 0.95 }, md5: '7bf64c587c2966db05e4bf44e8c78d72', hitobjects: 315 + 9000, colors: ['#3392D9', '#5C1007', '#97095D', '#1E1E1E'] },
        { id: 'azimuth', name: 'AZIMUTH ψ dan', clear: { accuracy: 0.95 }, md5: '21a9c6b63a722f5903375497306c1c6f', hitobjects: 245 + 10735, colors: ['#4F6B93', '#BA7A9D', '#2CA1EA', '#A3A9F6'] },
        { id: 'zenith', name: 'ZENITH ζ dan', clear: { accuracy: 0.95 }, md5: '4ad36f558655a1f17781038517455215', hitobjects: 350 + 12000, colors: ['#D60C30', '#590505', '#808080', '#353535'] },
        { id: 'stellium', name: 'STELLIUM ★ dan', clear: { accuracy: 0.95 }, md5: '5c5221176acd6b87980d80444da65dc3', hitobjects: 1826 + 12618, colors: ['#87295D', '#342B8A', '#272A29', '#FF8C31'] }
      ]
    }
  ]
}

function interpolateColors(color1: string, color2: string, weight: number): string {
  const r1: number = parseInt(color1.slice(1, 3), 16);
  const g1: number = parseInt(color1.slice(3, 5), 16);
  const b1: number = parseInt(color1.slice(5, 7), 16);

  const r2: number = parseInt(color2.slice(1, 3), 16);
  const g2: number = parseInt(color2.slice(3, 5), 16);
  const b2: number = parseInt(color2.slice(5, 7), 16);

  const r: number = Math.round(r1 + (r2 - r1) * weight);
  const g: number = Math.round(g1 + (g2 - g1) * weight);
  const b: number = Math.round(b1 + (b2 - b1) * weight);

  const interpolatedColor: string = `#${(r < 16 ? '0' : '') + r.toString(16)}${
    (g < 16 ? '0' : '') + g.toString(16)
  }${(b < 16 ? '0' : '') + b.toString(16)}`;

  return interpolatedColor;
}

function interpolateGradient(colors: string[], weight: number): string {
  const colorIndex: number = Math.floor(weight);
  return interpolateColors(
    colors[colorIndex],
    colors[colorIndex + 1],
    weight % 1
  );
}

// TODO: MAKE UPLOADING SAVE FILE PARSE ALL THE DAN SCORES

export function textToGradient(params: TTGParams): Result {
  let BBcode: string = '';
  let HTML: string = '';

  for (let i = 0; i < params.text.length; i++) {
    const color: string = interpolateGradient(
      params.colors,
      (i / params.text.length) * (params.colors.length - 1)
    ).toUpperCase();
    const character: string = params.text[i];
    BBcode += `[color=${color}]${character}[/color]`;
    HTML += `<span style='color: ${color}'>${character}</span>`
  }
 
  let resultBBcode: string = '';
  let resultHTML: string = '';

  if (params.has_title) {
    resultBBcode += '[notice]'
  }

  if (params.has_title && params.is_centered) {
    resultBBcode += '[centre]'
    resultHTML += '<div style="text-align: center">'
  }

  if (params.has_title) {
    resultBBcode += '\n'
  }

  if (params.has_title) {
    resultBBcode += `[size=150][b][i]${params.mappack_name}[/i][/b][/size]\n`
    resultHTML += `<span style="font-size: 150%; color: white"><strong><i>${params.mappack_name}</i></strong></span><br><br>`
  }

  if (params.has_image) {
    resultBBcode += '[box='
    if (params.closed_image)
      resultHTML += '<span style="color: white"><strong>>&nbsp&nbsp</strong></span>'
    else
      resultHTML += '<span style="color: white"><strong>∨&nbsp&nbsp</strong></span>'
  }

  if (params.is_bold) {
    resultBBcode += '[b]';
    resultHTML += '<strong>';
  }
  if (params.is_italic) {
    resultBBcode += '[i]';
    resultHTML += '<i>';
  }

  resultBBcode += BBcode;
  resultHTML += HTML;

  if (params.is_italic) {
    resultBBcode += '[/i]';
    resultHTML += '</i>';
  }
  if (params.is_bold) {
    resultBBcode += '[/b]';
    resultHTML += '</strong>';
  }

  if (params.suffix) {
    resultBBcode += `[color=#FFFFFF] ${params.suffix}[/color]`;
    resultHTML += `<span style='color: #FFFFFF'> ${params.suffix}</span>`
  }

  if (params.comment) {
    resultBBcode += `[color=#808080] ${params.comment}[/color]`
    resultHTML += `<span style='color: #808080'> ${params.comment}</span>`
  }

  if (params.has_image) {
    resultBBcode += ']\n'
  }

  if (params.has_image && params.has_video) {
    resultBBcode += `[url=${params.videoURL}]`
    resultHTML += `<a href="${params.videoURL}">`
  }

  if (params.has_image) {
    resultBBcode += `[img]${params.imageURL}[/img]`
    if (!params.closed_image)
      resultHTML += '<br>'
    resultHTML += `<img src="${params.imageURL}" style="max-width: 100%; margin: 10px">`
  }
  
  if (params.has_image && params.has_video) {
    resultBBcode += '[/url]'
    resultHTML += '</a>'
  }

  if (params.has_image) {
    resultBBcode += '\n[/box]'
  }

  if (params.has_title) {
    resultBBcode += '\n'
  }

  if (params.has_title && params.is_centered) {
    resultBBcode += '[/centre]'
    resultHTML += '</div>'
  }

  if (params.has_title) {
    resultBBcode += '[/notice]'
  }

  return { html: resultHTML, bbcode: resultBBcode};
}

export function getMappackByHash(mappacks: Mappack[], md5: string): [Mappack, Difficulty] | [null, null] {
  for (const mappack of mappacks) {
    for (const difficulty of mappack.difficulties) {
      if (difficulty.md5 == md5) {
        return [mappack, difficulty];
      }
    }
  }
  return [null, null];
}

export function getMappackById(mappacks: Mappack[], id: string): Mappack | undefined {
  return mappacks.find(mappack => mappack.id === id);
}

export function getDifficultiesById(mappacks: Mappack[], id: string): Difficulty[] {
  let mappack: Mappack | undefined = getMappackById(mappacks, id);
  if (mappack == undefined)
    return [];
  return mappack.difficulties;
}

export function getDifficultyById(mappacks: Mappack[], mappack_id: string, difficulty_id: string): Difficulty | undefined {
  let mappack = mappacks.find(mappack => mappack.id === mappack_id);
  if (mappack == undefined)
    return undefined;
  let difficulty = mappack.difficulties.find(difficulty => difficulty.id === difficulty_id);
  if (difficulty == undefined)
    return undefined;
  return difficulty;
}