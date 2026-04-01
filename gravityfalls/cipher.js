const messages = [
    {
        episode: "Theme Song",
        messages: ["VWDQ LV QRW ZKDW KH VHHPV"]
    },
    {
        episode: "S01E01 Tourist Trapped",
        messages: ["ZHOFRPH WR JUDYLWB IDOOV."]
    },
    {
        episode: "S01E02 The Legend of the Gobblewonker",
        messages: ["QHAW ZHHN: UHWXUQ WR EXWW LVODQG."]
    },
    {
        episode: "S01E03 Headhunters",
        messages: ["KH'V VWLOO LQ WKH YHQWV."]
    },
    {
        episode: "S01E04 The Hand That Rocks the Mabel",
        messages: ["FDUOD, ZKB ZRQ'W BRX FDOO PH?"]
    },
    {
        episode: "S01E05 The Inconveniencing",
        messages: ["RQZDUGV DRVKLPD!"]
    },
    {
        episode: "S01E06 Dipper vs. Manliness",
        messages: ["PU. FDHVDULDQ ZLOO EH RXW QHAW ZHHN. PU. DWEDVK ZLOO VXEVWLWXWH."]
    },
    {
        episode: "S01E07 Double Dipper",
        messages: ["KZKVI QZN WRKKVI HZBH: \"ZFFTSDCJSTZWHZWFS!\""]
    },
    {
        episode: "S01E08 Irrational Treasure",
        messages: [
            //"0239548604", // Dollar Bill Serial Number
            "V. KOFIRYFH GIVNYOVB."
        ],
    },
    {
        episode: "S01E09 The Time Traveler's Pig",
        messages: ["MLG S.T. DVOOH ZKKILEVW."]
    },
    {
        episode: "S01E10 Fight Fighters",
        messages: ["HLIIB, WRKKVI, YFG BLFI DVMWB RH RM ZMLGSVI XZHGOV."]
    },
    {
        episode: "S01E11 Little Dipper",
        messages: ["GSV RMERHRYOV DRAZIW RH DZGXSRMT."]
    },
    {
        episode: "S01E12 Summerween",
        messages: ["YILFTSG GL BLF YB SLNVDLIP: GSV XZMWB."]
    },
    {
        episode: "S01E13 Boss Mabel",
        messages: ["SVZEB RH GSV SVZW GSZG DVZIH GSV UVA."]
    },
    {
        episode: "S01E14 Bottomless Pit!",
        messages: ["14-5-24-20 21-16: \"6-15-15-20-2-15-20 20-23-15: 7-18-21-14-11-12-5'19 7-18-5-22-5-14-7-5.\""]
    },
    {
        episode: "S01E15 The Deep End",
        messages: ["22-9-22-1-14 12-15-19 16-1-20-15-19 4-5 12-1 16-9-19-3-9-14-1."]
    },
    {
        episode: "S01E16 Carpet Diem",
        messages: [
            "SXEHUWB LV WKH JUHDWHVW PBVWHUB RI DOO DOVR: JR RXWVLGH DQG PDNH IULHQGV.",
            "2-21-20 23-8-15 19-20-15-12-5 20-8-5 3-1-16-5-18-19?",
        ],
    },
    {
        episode: "S01E17 Boyz Crazy",
        messages: ["8-1-16-16-25 14-15-23, 1-18-9-5-12?"]
    },
    {
        episode: "S01E18 Land Before Swine",
        messages: [
            "OLHV",
            "9-20 23-15-18-11-19 6-15-18 16-9-9-9-9-9-9-9-9-9-9-9-9-9-9-9-9-9-7-19!",
        ],
    },
    {
        episode: "S01E19 Dreamscaperers",
        messages: [
            "PBVWHUB VKDFN",
            "SLWW",
            "OAUVG",
            "EWTUG AQW OCTKNAP",
            "20-15 2-5 3-15-14-20-9-14-21-5-4...",
        ],
    },
    {
        episode: "S01E20 Gideon Rises",
        messages: [
            "ELOO LV ZDWFKLQJ",
            "18-5-22-5-18-19-5 20-8-5 3-9-16-8-5-18-19",
            "5-19-23-6-21-16 18-9-6 4-16-19 22-12-15-10-20-19-25-19"
        ],
    },

    // Shorts
    {
        episode: "Interseason E01 Candy Monster",
        messages: ["IURP WKH ILUVW XQWLO WKH ODVW VHDUFK WKH",]
    },
    {
        episode: "Interseason E04 Lefty",
        messages: ["WKHP DOO ZHOFRPH WR JUDYLWB IDOOV",]
    },
    {
        episode: "Interseason E05 Tooth",
        messages: ["FRGHV RI FUHGLWV SDVW RQH PHDQV RQH VR VHDUFK",]
    },

    /*
      Gravity Falls Shorts
      These aren't normal codes. The first number refers to the episode,
      and the subsequent ones refer to a letter in that episode's end-credits
      cryptogram. Ignore for now...

      "Candy Monster"
      [13) 8,9,10] [14,17,22

      "Stan's Tattoo"
      [1)14] [2)5,24 3)3] [5)7,9]

      "Mailbox"
      [6)33,40,46 9)1,18] [10)32,33][39

      "Lefty"
      [17)6,12 20) 3,4]

      "Tooth"
      [14)21,30,32 15)13,20][22 16)20

      "The Hide-Behind"
      11)4,12,18] [12)8,9][17,18]
    */

    // Season 2
    {
        episode: "S02E01 Scary-oke",
        messages: [
            "5-19-23-6-21-16 18-9-6 4-16-19...",
            "6-12-1-7",
            "TEV FP TBKAV PL MBOCBZQ",
            "ZDWFK RXW",
            "NLOO PH SOHDVH",
            "SMOFZQA JDFV",
            "4-16-19 11-23-10 20-9-1-10-5-4-23-15-6-5 15-5 2-19-6-25 21-12-19-2-19-6\n21-23-10 16-19 16-15-20-19 16-15-5 8-12-23-10-5 18-9-6-19-2-19-6?",
        ],
    },
    {
        episode: "S02E02 Into the Bunker",
        messages: [
            "010100000111010101110\n1000010000001100001\n011011000110110000100\n000011100110110100101\n11100000100000011100\n000110100101100101011\n000110110010101110011\n00100000011101000110\n11110110011101100101011\n10100011010000110010\n10111001000100001",
            "OOIY DMEV VN IBWRKAMW BRUWLL",
            "15-11-8-6-9-8-19-6 3-5-19 9-18 11-23-21-16-15-10-19-6-25 21-9-3-12-20\n12-19-23-20 4-9 3-4-4-19-6 21-23-4-23-5-4-6-9-8-16-19",
        ],
    },
    {
        episode: "S02E03 The Golf War",
        messages: [
            "NLMXQWWN IIZ LZFNF",
            "9-12-20 11-23-10 5-12-19-19-8-15-10-17 9-10 4-16-19 17-6-19-19-10\n21-23-10'4 16-19-12-8 22-3-4 1-9-10-20-19-6 1-16-23-4 16-19'5 5-19-19-10",
        ],
    },
    {
        episode: "S02E04 Sock Opera",
        messages: [
            "KFIV VMVITB, MLG HPRM ZMW YLMV",
            "IRHRMT ORPV GSV HSVKZIW GLMV",
            "ZLGGOH",
            "VKLIWHU",
            "ZKDWHYV",
            "EHDUR",
            "YM’KL ECN PPK WFOM UBR KQVXNLK, DCI SIK’U VDA JFTOTA AYQ BWL VVCT \"EBTGGB BHWKGZH\" HVV: TMEASZFA LOS YCDT PRWKTIYEKGL DBV XQDTYRDGVI",
            "10-9 8-3-8-8-19-4 5-4-6-15-10-17-5 21-23-10 16-9-12-20 11-19 20-9-1-10\n5-9 8-23-4-15-19-10-4-12-25 15 1-23-4-21-16 4-16-15-5 4-9-1-10\n23-22-10-9-6-11-23-12 5-9-9-10 1-15-12-12 22-19 4-16-19 10-9-6-11\n19-10-14-9-25 4-16-19 21-23-12-11 22-19-18-9-6-19 4-16-19 5-4-9-6-11\n",
        ],
    },
    {
        episode: "S02E05 Soos and the Real Girl",
        messages: [
            "VWDQ LV QRW ZKDW KH VHHPV More info icon",
            "01010011010100000100000101000011010001010100\n10100100000101001101010101000101011101001111",
            "BRTYMEMNX QBR HRRQPEE",
            "1-15-10-10-15-10-17 16-19-23-6-4-5 22-25 20-23-25-12-15-17-16-4\n8-9-5-5-19-5-5-15-10-17 6-9-22-9-4-5 22-25 11-9-9-10-12-15-17-16-4\n16-19-6 19-11-9-4-15-9-10-23-12 22-23-17-17-23-17-19 15-5 23 6-19-23-12 18-6-15-17-16-4\n5-16-19 16-23-5 4-16-19 9-10-19 10-23-11-19 17-15-18-18-23-10-25",
        ],
    },
    {
        episode: "S02E06 Little Gift Shop of Horrors",
        messages: [
            "PVREK BIG QF. JCDQZRF’ ZNVEFH OBCX: \"C BEWRS VVUTBFL BT BKNX CVAY BKNX CVAY BKNX\"",
            "23-12-12 23-10-15-11-23-4-15-9-10\n15-5 22-12-23-21-13 11-23-17-15-21",
        ],
    },
    {
        episode: "S02E07 Society of the Blind Eye",
        messages: [
            "YROO XRKSVI! GIRZMTOV!",
            "MXNGVEECW MW SLAWW. SUL FPZSK MW SOJMRX.",
            "17-15-20-19-9-10’5 4-23-10-4-6-3-11-5, 11-15-5-5-8-19-12-12-19-20 4-23-4-4-9-9-5,\n5-16-23-10-20-6-23’5 6-19-14-19-21-4-15-9-10-5, 5-9-21-15-19-4-25’5 2-15-19-1-5,\n23 18-19-23-6 9-18 1-15-4-21-16-19-5, 23 12-15-18-19 9-18 6-19-17-6-19-4,\n4-16-19-5-19 23-6-19 4-16-19 4-16-15-10-17-5 4-16-23-4 4-16-19-25 4-6-25 4-9 18-9-6-17-19-4",
        ],
    },
    {
        episode: "S02E08 Blendin's Game",
        messages: [
            "FOC'T FW MVV VIBE EZBAV KF NOW KTB'K FO IHG BBAV VIBE.",
            "14-9-15-10 4-16-19 4-15-11-19 8-23-6-23-20-9-26 23-2-9-15-20-23-10-21-19 19-10-18-9-6-21-19-11-19-10-4 5-7-3-23-20-6-9-10!\n17-6-19-23-4 16-9-3-6-5!\n5-9-12-15-20 22-19-10-19-18-15-4-5!\n5-15-17-10 3-8 25-19-5-4-19-6-20-23-25!\n",
        ],
    },
    {
        episode: "S02E09 The Love God",
        messages: [
            "O SAM KVGS.",
            "23-4 4-16-19 8-12-23-25 9-6 23-4 4-16-19 18-23-15-6,\n15 23-12-1-23-25-5 5-19-19 4-16-19-11 5-4-23-10-20-15-10-17 4-16-19-6-19\n20-6-19-5-5-19-20 15-10 22-12-23-21-13 4-16-19-25'6-19 9-10 11-25 12-23-1-10,\n22-3-4 1-16-19-10 15 4-3-6-10 11-25 16-19-23-20 4-16-19-25'6-19 17-9-10-19",
        ],
    },
    {
        episode: "S02E10 Northwest Mansion Mystery",
        messages: [
            "PYOL YS QH LLFDJW: UAH DNCVFW ZTCKW XKG WFFWWKNLLMRP? WISAGCXJ AR WKUISW! DPX WDSUKXR: LLH UBFO.",
            "5-4-23-10-15-5-10-9-4-1-16-23-4-16-19-5-19-19-11-5\n5-4-23-10-15-5-10-9-4-1-16-23-4-16-19-5-19-19-11-5\n5-4-23-10-15-5-10-9-4-1-16-23-4-16-19-5-19-19-11-5",
        ],
    },
    {
        episode: "S02E11 Not What He Seems",
        messages: [
            "JXYDPHQW",
            "LAR ZPUHTFTY XWEUPJR GHGZT",
            "4-16-15-6-4-25 25-19-23-6-5 23-10-20 10-9-1 16-19’5 22-23-21-13\n4-16-19 11-25-5-4-19-6-25 15-10 4-16-19 11-25-5-4-19-6-25 5-16-23-21-13",
        ],
    },
    {
        episode: "S02E12 A Tale of Two Stans",
        messages: [
            "TIZOLHAJSIW CKMMWZPMKQ: GLY KJQBH",
            "23 5-4-3-22-22-9-6-10 4-9-3-17-16 10-19-1 14-19-6-5-19-25 10-23-4-15-2-19\n18-15-12-22-6-15-21-13 1-23-5-10'4 4-9-9 21-6-19-23-4-15-2-19\n16-23-2-15-10-17 4-1-15-10-5 1-23-5 10-9-4 16-15-5 8-12-23-10\n5-9 16-19 14-3-5-4 5-16-6-3-17-17-19-20 23-10-20 10-23-11-19-20 22-9-4-16 5-4-23-10",
            "YROO XRKSVI GIRZMTOV",
        ],
    },
    {
        episode: "S02E13 Dungeons, Dungeons, and More Dungeons",
        messages: [
            "VXFQLKB-AYRTHHEJ!",
            "18-3-10 23-10-20 17-23-11-19-5 23-6-19 17-6-19-23-4 20-15-5-4-6-23-21-4-15-9-10-5\n22-3-4 5-11-23-12-12 4-16-15-10-17-5 21-23-10 16-23-2-19 21-16-23-15-10 6-19-23-21-4-15-9-10-5",
        ],
    },
    {
        episode: "S02E14 The Stanchurian Candidate",
        messages: [
            "CWZSQVQBEWZSQVQBEWZSQVQMPHKD 'MZ!",
            "22-19 1-23-6-25 9-18 1-16-9-11 25-9-3 22-19-12-15-4-4-12-19\n22-15-17 8-6-9-22-12-19-11-5 21-23-10 5-4-23-6-4 9-3-4 1-15-20-20-12-19",
        ],
    },
    {
        episode: "S02E15 The Last Mabelcorn",
        messages: [
            "S UPYTYH DIP GAVO QETHI MCBK OHK XEXJB VRW YOUWCHIA VRSV OQ LRDIA",
            "15-10 21-15-8-16-19-6'5 17-23-11-19 16-19 10-19-19-20-5 23 8-23-1-10\n22-19 5-3-6-19 4-9 13-10-9-1 1-16-15-21-16 5-15-20-19 25-9-3'6-19 9-10",
        ],
    },
    {
        episode: "S02E16 Roadside Attraction",
        messages: [
            "VCDH, PZNS P CSSOS VDPUHB GTXILSKTV, VYSCIYROZN USLQR WXW NDM WDQVZOGS, EEG PTUVZHBSTH R WOAZMEJ PJAPURU PCH JDGHN GRW OADRX WVT LEP",
            "21-23-6-12-23 11-21-21-9-6-13-12-19 6-19-4-3-6-10-19-20 23-12-12 16-15-5 18-12-9-1-19-6-5\n11-23-6-15-12-25-10 20-15-2-9-6-21-19-20 16-15-11 23-18-4-19-6 9-10-12-25 5-15-26 16-9-3-6-5\n22-19-23-4-6-15-21-19 5-12-23-8-8-19-20 16-15-11 18-9-6 22-19-15-10-17 23 21-23-20\n9-12-20 17-9-12-20-15-19'5 4-16-19 22-19-5-4 17-15-6-12-18-6-15-19-10-20 5-4-23-10 19-2-19-6 16-23-20",
        ],
    },
    {
        episode: "S02E17 Dipper and Mabel vs. the Future",
        messages: [
            "ETX CPI ASTD GI?",
            "4-16-19 8-6-9-8-16-19-21-25 5-19-19-11-19-20 18-23-6 23-1-23-25\n22-3-4 18-15-10-23-12-12-25 1-19'2-19 6-19-23-21-16-19-20 4-16-19 20-23-25.\n17-15-2-19 3-8 4-16-19 8-23-5-4. 19-11-22-6-23-21-19 4-16-19 5-4-6-23-10-17-19.\n19-2-19-6-25-4-16-15-10-17 25-9-3 21-23-6-19 23-22-9-3-4 1-15-12-12 21-16-23-10-17-19.",
        ],
    },
    {
        episode: "S02E18 Weirdmageddon Part 1",
        messages: [
            "KB HTMT IHOV 1,000 AMLCT NDY XZOM MLCG'H TSCGKFWFA IV VVEWYDUQIBXV, CVO HIMC OI'J DINV, IM'H NSZPO EZ CM KLVP EZLYLG",
            "17-23-11-19 15-5 9-2-19-6, 23-10-20 15 1-9-10\n10-9-1 15-4'5 4-15-11-19 4-9 5-4-23-6-4 4-16-19 18-3-10\n15 23-12-1-23-25-5 12-9-2-19 21-9-6-6-3-8-4-15-10-17 12-15-2-19-5\n10-9-1 12-19-4'5 5-19-19 1-16-15-21-16 8-15-10-19-5 5-3-6-2-15-2-19-5",
        ],
    },
    {
        episode: "S02E19 Weirdmageddon 2: Escape From Reality",
        messages: [
            "FZPO YSU BQSHZ LTLY FR LV UCC IFJ CIYHO LTEYWKQWUW II P KFASJ JKQASPJE'W LLOMKXQNFR FLWEDGI",
            "1-16-19-10 9-10-19 17-19-4-5 4-6-23-8-8-19-20 15-10-5-15-20-19 4-16-19 8-23-5-4\n20-6-19-23-11-5 21-23-10 4-3-6-10 4-9 10-15-17-16-4-11-23-6-19-5 18-23-5-4",
        ],
    },
    {
        episode: "S02E20 Weirdmageddon 3: Take Back The Falls",
        messages: [
            "KVOU VTKSE XVREOW DQTMJKGD MF KNLJH CVE 900 YCHJZ OH XXFB PJPSKC FVQUSIOV LHP: FRNLLCDBFBF",
            "4-19-10 5-25-11-22-9-12-5 8-12-23-21-19-20 23-6-9-3-10-20 23 1-16-19-19-12\n16-23-10-20 15-10 16-23-10-20 4-16-19-25'12-12 22-9-10-20 4-16-19 5-19-23-12\n22-3-4 22-6-19-23-13 4-16-19 21-16-23-15-10, 23-10-20 8-23-25 4-16-19 21-9-5-4\n4-16-19 8-6-9-8-16-19-21-25 1-15-12-12 23-12-12 22-19 12-9-5-4",
        ],
    },
    {
        episode: "S02E21 Weirdmageddon 4: Somewhere in The Woods",
        messages: [
            "ZMFUIGV PSHP IGK AGTAYAG TRMNE VVGSQW KLE JOJXU GIMWZ",
            "GLCOPRP GOOGWMJ FXZWG",
            "18-23-20-19-20 8-15-21-4-3-6-19-5 22-12-19-23-21-16-19-20 22-25 5-3-10\n4-16-19 4-23-12-19'5 4-9-12-20, 4-16-19 5-3-11-11-19-6'5 20-9-10-19\n15-10 11-19-11-9-6-15-19-5 4-16-19 8-15-10-19-5 5-4-15-12-12 8-12-23-25\n9-10 23 5-3-10-10-25 5-3-11-11-19-6'5 20-23-25",
        ],
    },
];

function populateMessage(i) {
    if (i < 0) return;
    const textBox = document.getElementById("cipherInput");
    textBox.value = options[i];
}

function a1z26Decode(input) {
    const A = "A".charCodeAt(0);

    let output = "";
    for (let i=0; i<input.length; i++) {
        let c1 = input[i];
        let n1 = Number(c1);
        let d1 = c1.charCodeAt(0);
        if (isNaN(n1) || c1 == " " || d1 == 10) {
            if (c1 != "-")
                output += c1;
            continue;
        }

        if (i < input.length) {
            let c2 = input[i+1];
            let n2 = Number(c2);
            let d2 = 0
            if (c2 != undefined)
                d2 = c2.charCodeAt(0);
            if (!isNaN(n2) && c2 != " " && d2 != 10) {
                n1 *= 10;
                n1 += n2;
                i++;
            }
        }

        output += String.fromCharCode(n1 + A - 1);
    }

    /*
      for (let word of input.split(" ")) {
        for (let character of word.split("-")) {
            output += String.fromCharCode(Number(character) + A - 1);
        }
        output += " ";
      }
    */

    return output;
}

function ceasarDecode(input, n) {
    const A = "A".charCodeAt(0);
    const a = "a".charCodeAt(0);

    let output = "";
    for (let c of input) {
        let charCode = c.charCodeAt(0);
        if (charCode >= A && charCode <= A + 26) { // Check if A-Z
            charCode -= A;
            charCode += Number(n);
            charCode += 26;
            charCode %= 26;
            charCode += A;
            output += String.fromCharCode(charCode);
        } else if (charCode >= a && charCode <= a + 26) { // Check if a-z
            charCode -= a;
            charCode += Number(n);
            charCode += 26;
            charCode %= 26;
            charCode += a;
            output += String.fromCharCode(charCode);
        } else { // Otherwise it's a punctuation - ignore
            output += c;
        }
    }

    return output;
}

function atbashDecode(input) {
    const A = "A".charCodeAt(0);
    const a = "a".charCodeAt(0);

    let output = "";
    for (let c of input) {
        let charCode = c.charCodeAt(0);
        if (charCode >= A && charCode <= A + 26) { // Check if A-Z
            charCode -= A;
            charCode = 25 - charCode;
            charCode += A;
            output += String.fromCharCode(charCode);
        } else if (charCode >= a && charCode <= a + 26) { // Check if a-z
            charCode -= a;
            charCode = 25 - charCode;
            charCode += a;
            output += String.fromCharCode(charCode);
        } else { // Otherwise it's a punctuation - ignore
            output += c;
        }
    }

    return output;
}

function vigenereDecode(input, key) {
    const A = "A".charCodeAt(0);
    const a = "a".charCodeAt(0);

    let output = "";

    // Create expanded key (repeated key, but with same spaces as message)
    let expandedKey = "";
    let i = 0;
    let j = 0;
    while (expandedKey.length < input.length) {
        let c = input[j].charCodeAt(0);
        if (c >= A && c < A+26 || c >= a && c < a+26) {
            expandedKey += key[i % key.length];
            i++
        } else {
            expandedKey += " ";
        }
        j++
    }

    for (let i=0; i<input.length; i++) {
        let n = expandedKey[i];
        n = n.charCodeAt(0);
        if (n >= A && n < A+26)
            n -= A;
        else if (n >= a && n < a+26)
            n -= a;
        else
            n = 0;
        output += ceasarDecode(input[i], -n);
    }

    return output;
}

function recomputeAllCiphers() {
    const input = document.getElementById("cipherInput").value;
    let output = input;

    if (document.getElementById("useA1z26").checked) {
        output = a1z26Decode(output);
    }

    if (document.getElementById("useCeasar").checked) {
        output = ceasarDecode(
            output,
            document.getElementById("ceasarShift").value
        );
    }

    if (document.getElementById("useAtbash").checked) {
        output = atbashDecode(output);
    }

    if (document.getElementById("useVigenere").checked) {
        output = vigenereDecode(
            output,
            document.getElementById("vigenereKey").value
        );
    }

    resultContainer = document.getElementById("cipherOutput");
    resultContainer.innerHTML = "";

    for (let line of output.split('\n')) {
        let resultLine = document.createElement("p");
        resultLine.innerHTML = line;
        resultContainer.appendChild(resultLine);
    }
}

let options = [];

function onLoad() {
    // Main Input
    const mainInput = document.getElementById("cipherInput");
    mainInput.oninput = () => {
        recomputeAllCiphers();
    };

    // Populate Pulldown Selector
    const messageSelect = document.getElementById("preloadedMessages");
    for (let episode of messages) {
        let count = 0;
        for (let message of episode.messages) {
            let option = document.createElement("option");
            option.value = options.length;
            option.innerHTML = episode.episode;
            if (episode.messages.length > 1)
                option.innerHTML = `${episode.episode} (${count+1})`;
            options.push(message);
            messageSelect.appendChild(option);
            count++;
        }
    }

    // Hook up selection to populate text input
    messageSelect.onchange = () => {
        populateMessage(Number(messageSelect.value));
        recomputeAllCiphers();
    };

    // Populate ceasar shift selector
    const ceasarShiftSelect = document.getElementById("ceasarShift");
    for (let i=-13; i<=13; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        ceasarShiftSelect.appendChild(option);
    }
    ceasarShiftSelect.value = 0;

    // Hook up cipher setting inputs
    ceasarShiftSelect.onchange = () => {
        recomputeAllCiphers();
    };
    document.getElementById("vigenereKey").oninput = () => {
        recomputeAllCiphers();
    };

    // Hook up checkboxes
    document.getElementById("useA1z26").onchange = () => {
        recomputeAllCiphers();
    };
    document.getElementById("useCeasar").onchange = () => {
        recomputeAllCiphers();
    };
    document.getElementById("useAtbash").onchange = () => {
        recomputeAllCiphers();
    };
    document.getElementById("useVigenere").onchange = () => {
        recomputeAllCiphers();
    };

    // Compute
    recomputeAllCiphers();
}

window.onload = function () {
    onLoad();
};
