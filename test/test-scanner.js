//  To run this test make sure Mocha is installed.
//  Command (run in root directory):
//  sudo npm install -g mocha

var should = require('should');
var scan = require('../scanner')
var error = require('../error')
var i = require('util').inspect

//  Removes error messages for Mocha testing.
error.quiet = true

//  Added message for those who may change test files in future.
console.log("WARNING: CHANGING TEST FILES WILL AFFECT MOCHA SUCCESS.")

// Template for token checking.
// i(tokens[]).should.equal(i())

describe('The scanner', function () {
    //  hello-world.ks
    it('scans the simplest program', function (done) {
        scan('test/kobra-code/good-programs/hello-world.ks', function (tokens) {
            tokens.length.should.equal(7)
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'hello',line:1,col:3}))
            i(tokens[2]).should.equal(i({kind:'=',lexeme:'=',line:1,col:9}))
            i(tokens[3]).should.equal(i({kind:'STRLIT',lexeme:'Hello, world!',line:1,col:11}))
            i(tokens[4]).should.equal(i({kind:'say',lexeme:'say',line:2,col:1}))
            i(tokens[5]).should.equal(i({kind:'ID',lexeme:'hello',line:2,col:5}))
            i(tokens[6]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })

    //  Person.ksb
    it('properly processes a Blueprint file', function (done) {
        scan('test/kobra-code/good-programs/Person.ksb', function (tokens) {
            tokens.length.should.equal(115)
            //    First line.
            i(tokens[0]).should.equal(i({kind:'blueprint',lexeme:'blueprint',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'Person',line:1,col:11}))
            i(tokens[2]).should.equal(i({kind:'(',lexeme:'(',line:1,col:18}))
            i(tokens[3]).should.equal(i({kind:'ID',lexeme:'name',line:1,col:19}))
            i(tokens[4]).should.equal(i({kind:',',lexeme:',',line:1,col:23}))
            i(tokens[5]).should.equal(i({kind:'ID',lexeme:'age',line:1,col:25}))
            i(tokens[6]).should.equal(i({kind:',',lexeme:',',line:1,col:28}))
            i(tokens[7]).should.equal(i({kind:'ID',lexeme:'hairColor',line:1,col:30}))
            i(tokens[8]).should.equal(i({kind:',',lexeme:',',line:1,col:39}))
            i(tokens[9]).should.equal(i({kind:'ID',lexeme:'exercise',line:1,col:41}))
            i(tokens[10]).should.equal(i({kind:',',lexeme:',',line:1,col:49}))
            i(tokens[11]).should.equal(i({kind:'ID',lexeme:'weight',line:1,col:51}))
            i(tokens[12]).should.equal(i({kind:')',lexeme:')',line:1,col:57}))
            i(tokens[13]).should.equal(i({kind:':',lexeme:':',line:1, col:58}))
            //    End first line, has time.
            i(tokens[14]).should.equal(i({kind:'@',lexeme:'@',line:3,col:1}))
            i(tokens[15]).should.equal(i({kind:'has',lexeme:'has',line:3,col:2}))
            i(tokens[16]).should.equal(i({kind:'ID',lexeme:'name',line:4,col:5}))
            i(tokens[17]).should.equal(i({kind:':',lexeme:':',line:4,col:9}))
            i(tokens[18]).should.equal(i({kind:'ID',lexeme:'name',line:4,col:11}))
            i(tokens[19]).should.equal(i({kind:',',lexeme:',',line:4,col:15}))
            i(tokens[20]).should.equal(i({kind:'ID',lexeme:'age',line:5,col:5}))
            i(tokens[21]).should.equal(i({kind:':',lexeme:':',line:5,col:8}))
            i(tokens[22]).should.equal(i({kind:'ID',lexeme:'age',line:5,col:10}))
            i(tokens[23]).should.equal(i({kind:',',lexeme:',',line:5,col:13}))
            i(tokens[24]).should.equal(i({kind:'ID',lexeme:'hairColor',line:6,col:5}))
            i(tokens[25]).should.equal(i({kind:':',lexeme:':',line:6,col:14}))
            i(tokens[26]).should.equal(i({kind:'ID',lexeme:'hairColor',line:6,col:16}))
            i(tokens[27]).should.equal(i({kind:'#',lexeme:'#',line:6,col:26}))
            i(tokens[28]).should.equal(i({kind:'STRLIT',lexeme:'black',line:6,col:28}))
            i(tokens[29]).should.equal(i({kind:',',lexeme:',',line:6,col:35}))
            i(tokens[30]).should.equal(i({kind:'ID',lexeme:'weight',line:7,col:5}))
            i(tokens[31]).should.equal(i({kind:':',lexeme:':',line:7,col:11}))
            i(tokens[32]).should.equal(i({kind:'ID',lexeme:'weight',line:7,col:13}))
            i(tokens[33]).should.equal(i({kind:'#',lexeme:'#',line:7,col:20}))
            i(tokens[34]).should.equal(i({kind:'NUMLIT',lexeme:'120',line:7,col:22}))

            //    Has done, Does time.
            i(tokens[35]).should.equal(i({kind:'@',lexeme:'@',line:9,col:1}))
            i(tokens[36]).should.equal(i({kind:'does',lexeme:'does',line:9,col:2}))
            i(tokens[37]).should.equal(i({kind:'ID',lexeme:'do_exercise',line:10,col:5}))
            i(tokens[38]).should.equal(i({kind:':',lexeme:':',line:10,col:16}))
            i(tokens[39]).should.equal(i({kind:'ID',lexeme:'exercise',line:10,col:18}))
            i(tokens[40]).should.equal(i({kind:'#',lexeme:'#',line:10,col:27}))
            i(tokens[41]).should.equal(i({kind:'ID',lexeme:'running',line:10,col:29}))
            i(tokens[42]).should.equal(i({kind:',',lexeme:',',line:10,col:36}))
            i(tokens[43]).should.equal(i({kind:'ID',lexeme:'weight',line:11,col:5}))
            i(tokens[44]).should.equal(i({kind:':',lexeme:':',line:11,col:11}))
            i(tokens[45]).should.equal(i({kind:'proc',lexeme:'proc',line:11,col:13}))
            i(tokens[46]).should.equal(i({kind:'(',lexeme:'(',line:11,col:18}))
            i(tokens[47]).should.equal(i({kind:')',lexeme:')',line:11,col:19}))
            i(tokens[48]).should.equal(i({kind:':',lexeme:':',line:11,col:20}))
            i(tokens[49]).should.equal(i({kind:'say',lexeme:'say',line:12,col:9}))
            i(tokens[50]).should.equal(i({kind:'STRLIT',lexeme:'I will weigh less',line:12,col:13}))
            i(tokens[51]).should.equal(i({kind:'..',lexeme:'..',line:13,col:5}))
            i(tokens[52]).should.equal(i({kind:',',lexeme:',',line:13,col:7}))
            i(tokens[53]).should.equal(i({kind:'ID',lexeme:'kilos',line:14,col:5}))
            i(tokens[54]).should.equal(i({kind:':',lexeme:':',line:14,col:10}))
            i(tokens[55]).should.equal(i({kind:'fn',lexeme:'fn',line:14,col:12}))
            i(tokens[56]).should.equal(i({kind:'(',lexeme:'(',line:14,col:14}))
            i(tokens[57]).should.equal(i({kind:'ID',lexeme:'x',line:14,col:15}))
            i(tokens[58]).should.equal(i({kind:')',lexeme:')',line:14,col:16}))
            i(tokens[59]).should.equal(i({kind:':',lexeme:':',line:14,col:17}))
            i(tokens[60]).should.equal(i({kind:'return',lexeme:'return',line:15,col:9}))
            i(tokens[61]).should.equal(i({kind:'ID',lexeme:'x',line:15,col:16}))
            i(tokens[62]).should.equal(i({kind:'/',lexeme:'/',line:15,col:18}))
            i(tokens[63]).should.equal(i({kind:'NUMLIT',lexeme:'2.2',line:15,col:20}))
            i(tokens[64]).should.equal(i({kind:'end',lexeme:'end',line:16,col:5}))
            //    Begin synget.
            i(tokens[65]).should.equal(i({kind:'@',lexeme:'@',line:18,col:1}))
            i(tokens[66]).should.equal(i({kind:'syn',lexeme:'syn',line:18,col:2}))
            i(tokens[67]).should.equal(i({kind:':',lexeme:':',line:18,col:5}))
            i(tokens[68]).should.equal(i({kind:'ID',lexeme:'get',line:18,col:6}))
            i(tokens[69]).should.equal(i({kind:'ID',lexeme:'name',line:20,col:5}))
            i(tokens[70]).should.equal(i({kind:':',lexeme:':',line:20,col:9}))
            i(tokens[71]).should.equal(i({kind:'fn',lexeme:'fn',line:20,col:11}))
            i(tokens[72]).should.equal(i({kind:'(',lexeme:'(',line:20,col:14}))
            i(tokens[73]).should.equal(i({kind:')',lexeme:')',line:20,col:15}))
            i(tokens[74]).should.equal(i({kind:':',lexeme:':',line:20,col:16}))
            i(tokens[75]).should.equal(i({kind:'return',lexeme:'return',line:20,col:18}))
            i(tokens[76]).should.equal(i({kind:'ID',lexeme:'name',line:20,col:25}))
            i(tokens[77]).should.equal(i({kind:'..',lexeme:'..',line:20,col:30}))
            i(tokens[78]).should.equal(i({kind:',',lexeme:',',line:20,col:32}))
            i(tokens[79]).should.equal(i({kind:'ID',lexeme:'age',line:21,col:5}))
            i(tokens[80]).should.equal(i({kind:':',lexeme:':',line:21,col:8}))
            i(tokens[81]).should.equal(i({kind:'fn',lexeme:'fn',line:21,col:10}))
            i(tokens[82]).should.equal(i({kind:'(',lexeme:'(',line:21,col:13}))
            i(tokens[83]).should.equal(i({kind:')',lexeme:')',line:21,col:14}))
            i(tokens[84]).should.equal(i({kind:':',lexeme:':',line:21,col:15}))
            i(tokens[85]).should.equal(i({kind:'return',lexeme:'return',line:21,col:17}))
            i(tokens[86]).should.equal(i({kind:'ID',lexeme:'age',line:21,col:24}))
            i(tokens[87]).should.equal(i({kind:'..',lexeme:'..',line:21,col:28}))
            i(tokens[88]).should.equal(i({kind:',',lexeme:',',line:21,col:30}))
            i(tokens[89]).should.equal(i({kind:'ID',lexeme:'hairColor',line:22,col:5}))
            i(tokens[90]).should.equal(i({kind:':',lexeme:':',line:22,col:14}))
            i(tokens[91]).should.equal(i({kind:'fn',lexeme:'fn',line:22,col:16}))
            i(tokens[92]).should.equal(i({kind:'(',lexeme:'(',line:22,col:19}))
            i(tokens[93]).should.equal(i({kind:')',lexeme:')',line:22,col:20}))
            i(tokens[94]).should.equal(i({kind:':',lexeme:':',line:22,col:21}))
            i(tokens[95]).should.equal(i({kind:'return',lexeme:'return',line:22,col:23}))
            i(tokens[96]).should.equal(i({kind:'ID',lexeme:'hairColor',line:22,col:30}))
            i(tokens[97]).should.equal(i({kind:'..',lexeme:'..',line:22,col:40}))
            //    Begin synset.
            i(tokens[98]).should.equal(i({kind:'@',lexeme:'@',line:24,col:1}))
            i(tokens[99]).should.equal(i({kind:'syn',lexeme:'syn',line:24,col:2}))
            i(tokens[100]).should.equal(i({kind:':',lexeme:':',line:24,col:5}))
            i(tokens[101]).should.equal(i({kind:'ID',lexeme:'set',line:24,col:6}))
            i(tokens[102]).should.equal(i({kind:'ID',lexeme:'hairColor',line:25,col:5}))
            i(tokens[103]).should.equal(i({kind:':',lexeme:':',line:25,col:14}))
            i(tokens[104]).should.equal(i({kind:'fn',lexeme:'fn',line:25,col:16}))
            i(tokens[105]).should.equal(i({kind:'(',lexeme:'(',line:25,col:18}))
            i(tokens[106]).should.equal(i({kind:'ID',lexeme:'newColor',line:25,col:19}))
            i(tokens[107]).should.equal(i({kind:')',lexeme:')',line:25,col:27}))
            i(tokens[108]).should.equal(i({kind:':',lexeme:':',line:25,col:28}))
            i(tokens[109]).should.equal(i({kind:'ID',lexeme:'color',line:26,col:9}))
            i(tokens[110]).should.equal(i({kind:'=',lexeme:'=',line:26,col:15}))
            i(tokens[111]).should.equal(i({kind:'ID',lexeme:'newColor',line:26,col:17}))
            i(tokens[112]).should.equal(i({kind:'end',lexeme:'end',line:27,col:5}))
            //    GG.
            i(tokens[113]).should.equal(i({kind:'defcc',lexeme:'defcc',line:29,col:1}))
            i(tokens[114]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })

    it('reads the exchange statement', function (done) {
        scan('test/kobra-code/good-programs/exchangestatement.ks', function (tokens) {
            tokens.length.should.equal(18)
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:4,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'a',line:4,col:3}))
            i(tokens[2]).should.equal(i({kind:'=',lexeme:'=',line:4,col:5}))
            i(tokens[3]).should.equal(i({kind:'NUMLIT',lexeme:'10',line:4,col:7}))
            i(tokens[4]).should.equal(i({kind:',',lexeme:',',line:4,col:9}))
            i(tokens[5]).should.equal(i({kind:'ID',lexeme:'b',line:5,col:3}))
            i(tokens[6]).should.equal(i({kind:'=',lexeme:'=',line:5,col:5}))
            i(tokens[7]).should.equal(i({kind:'NUMLIT',lexeme:'20',line:5,col:7}))
            i(tokens[8]).should.equal(i({kind:',',lexeme:',',line:5,col:9}))
            i(tokens[9]).should.equal(i({kind:'ID',lexeme:'c',line:6,col:3}))
            i(tokens[10]).should.equal(i({kind:',',lexeme:',',line:6,col:4}))
            i(tokens[11]).should.equal(i({kind:'ID',lexeme:'d',line:7,col:3}))
            i(tokens[12]).should.equal(i({kind:'=',lexeme:'=',line:7,col:5}))
            i(tokens[13]).should.equal(i({kind:'NUMLIT',lexeme:'20',line:7,col:7}))
            i(tokens[14]).should.equal(i({kind:'ID',lexeme:'b',line:9,col:1}))
            i(tokens[15]).should.equal(i({kind:':=:',lexeme:':=:',line:9,col:3}))
            i(tokens[16]).should.equal(i({kind:'ID',lexeme:'d',line:9,col:7}))
            i(tokens[17]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })

    it('reads vardecs and increments correctly', function (done) {
        scan('test/kobra-code/good-programs/increments.ks', function (tokens) {
            tokens.length.should.equal(19)
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'i',line:1,col:3}))
            i(tokens[2]).should.equal(i({kind:'=',lexeme:'=',line:1,col:5}))
            i(tokens[3]).should.equal(i({kind:'NUMLIT',lexeme:'0',line:1,col:7}))
            i(tokens[4]).should.equal(i({kind:',',lexeme:',',line:1,col:8}))
            i(tokens[5]).should.equal(i({kind:'ID',lexeme:'j',line:2,col:3}))
            i(tokens[6]).should.equal(i({kind:'=',lexeme:'=',line:2,col:5}))
            i(tokens[7]).should.equal(i({kind:'NUMLIT',lexeme:'0',line:2,col:7}))
            i(tokens[8]).should.equal(i({kind:'ID',lexeme:'i',line:4,col:1}))
            i(tokens[9]).should.equal(i({kind:'++',lexeme:'++',line:4,col:2}))
            i(tokens[10]).should.equal(i({kind:'ID',lexeme:'i',line:5,col:1}))
            i(tokens[11]).should.equal(i({kind:'--',lexeme:'--',line:5,col:2}))
            i(tokens[12]).should.equal(i({kind:'ID',lexeme:'j',line:6,col:1}))
            i(tokens[13]).should.equal(i({kind:'++',lexeme:'++',line:6,col:2}))
            i(tokens[14]).should.equal(i({kind:'++',lexeme:'++',line:7,col:1}))
            i(tokens[15]).should.equal(i({kind:'ID',lexeme:'j',line:7,col:3}))
            i(tokens[16]).should.equal(i({kind:'--',lexeme:'--',line:8,col:1}))
            i(tokens[17]).should.equal(i({kind:'ID',lexeme:'j',line:8,col:3}))
            i(tokens[18]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })

    //  object.ks
    it('reads our new object syntax', function (done) {
        scan('test/kobra-code/good-programs/object.ks', function (tokens) {
            tokens.length.should.equal(77)
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'bicycle',line:1,col:3}))
            i(tokens[2]).should.equal(i({kind:'=',lexeme:'=',line:1,col:11}))
            i(tokens[3]).should.equal(i({kind:'{',lexeme:'{',line:1,col:13}))
            i(tokens[4]).should.equal(i({kind:'ID',lexeme:'frame',line:2,col:5}))
            i(tokens[5]).should.equal(i({kind:':',lexeme:':',line:2,col:10}))
            i(tokens[6]).should.equal(i({kind:'STRLIT',lexeme:'aluminum',line:2,col:12}))
            i(tokens[7]).should.equal(i({kind:',',lexeme:',',line:2,col:22}))
            i(tokens[8]).should.equal(i({kind:'ID',lexeme:'year',line:3,col:5}))
            i(tokens[9]).should.equal(i({kind:':',lexeme:':',line:3,col:9}))
            i(tokens[10]).should.equal(i({kind:'NUMLIT',lexeme:'2009',line:3,col:11}))
            i(tokens[11]).should.equal(i({kind:',',lexeme:',',line:3,col:15}))
            i(tokens[12]).should.equal(i({kind:'ID',lexeme:'gears',line:4,col:5}))
            i(tokens[13]).should.equal(i({kind:':',lexeme:':',line:4,col:10}))
            i(tokens[14]).should.equal(i({kind:'NUMLIT',lexeme:'10',line:4,col:12}))
            i(tokens[15]).should.equal(i({kind:',',lexeme:',',line:4,col:14}))
            i(tokens[16]).should.equal(i({kind:'ID',lexeme:'speed',line:5,col:5}))
            i(tokens[17]).should.equal(i({kind:':',lexeme:':',line:5,col:10}))
            i(tokens[18]).should.equal(i({kind:'NUMLIT',lexeme:'12.7',line:5,col:12}))
            i(tokens[19]).should.equal(i({kind:',',lexeme:',',line:5,col:16}))
            i(tokens[20]).should.equal(i({kind:'ID',lexeme:'carbonFiber',line:6,col:5}))
            i(tokens[21]).should.equal(i({kind:':',lexeme:':',line:6,col:16}))
            i(tokens[22]).should.equal(i({kind:'BOOLIT',lexeme:'true',line:6,col:18}))
            i(tokens[23]).should.equal(i({kind:',',lexeme:',',line:6,col:22}))
            i(tokens[24]).should.equal(i({kind:'ID',lexeme:'extraParts',line:7,col:5}))
            i(tokens[25]).should.equal(i({kind:':',lexeme:':',line:7,col:15}))
            i(tokens[26]).should.equal(i({kind:'[',lexeme:'[',line:7,col:17}))
            i(tokens[27]).should.equal(i({kind:'STRLIT',lexeme:'speedometer',line:7,col:18}))
            i(tokens[28]).should.equal(i({kind:',',lexeme:',',line:7,col:31}))
            i(tokens[29]).should.equal(i({kind:'STRLIT',lexeme:'light',line:7,col:33}))
            i(tokens[30]).should.equal(i({kind:']',lexeme:']',line:7,col:40}))
            i(tokens[31]).should.equal(i({kind:',',lexeme:',',line:7,col:41}))
            i(tokens[32]).should.equal(i({kind:'ID',lexeme:'move',line:9,col:5}))
            i(tokens[33]).should.equal(i({kind:':',lexeme:':',line:9,col:9}))
            i(tokens[34]).should.equal(i({kind:'proc',lexeme:'proc',line:9,col:11}))
            i(tokens[35]).should.equal(i({kind:'(',lexeme:'(',line:9,col:16}))
            i(tokens[36]).should.equal(i({kind:')',lexeme:')',line:9,col:17}))
            i(tokens[37]).should.equal(i({kind:':',lexeme:':',line:9,col:18}))
            i(tokens[38]).should.equal(i({kind:'ID',lexeme:'Transform',line:10,col:9}))
            i(tokens[39]).should.equal(i({kind:'.',lexeme:'.',line:10,col:18}))
            i(tokens[40]).should.equal(i({kind:'ID',lexeme:'translate',line:10,col:19}))
            i(tokens[41]).should.equal(i({kind:'(',lexeme:'(',line:10,col:28}))
            i(tokens[42]).should.equal(i({kind:'ID',lexeme:'FORWARD',line:10,col:29}))
            i(tokens[43]).should.equal(i({kind:'*',lexeme:'*',line:10,col:37}))
            i(tokens[44]).should.equal(i({kind:'ID',lexeme:'this',line:10,col:39}))
            i(tokens[45]).should.equal(i({kind:'.',lexeme:'.',line:10,col:43}))
            i(tokens[46]).should.equal(i({kind:'ID',lexeme:'speed',line:10,col:44}))
            i(tokens[47]).should.equal(i({kind:')',lexeme:')',line:10,col:49}))
            i(tokens[48]).should.equal(i({kind:'end',lexeme:'end',line:11,col:5}))
            i(tokens[49]).should.equal(i({kind:',',lexeme:',',line:11,col:8}))
            i(tokens[50]).should.equal(i({kind:'ID',lexeme:'upgrade_speed',line:12,col:5}))
            i(tokens[51]).should.equal(i({kind:':',lexeme:':',line:12,col:18}))
            i(tokens[52]).should.equal(i({kind:'fn',lexeme:'fn',line:12,col:20}))
            i(tokens[53]).should.equal(i({kind:'(',lexeme:'(',line:12,col:23}))
            i(tokens[54]).should.equal(i({kind:')',lexeme:')',line:12,col:24}))
            i(tokens[55]).should.equal(i({kind:':',lexeme:':',line:12,col:25}))
            i(tokens[56]).should.equal(i({kind:'return',lexeme:'return',line:13,col:9}))
            i(tokens[57]).should.equal(i({kind:'ID',lexeme:'this',line:13,col:16}))
            i(tokens[58]).should.equal(i({kind:'.',lexeme:'.',line:13,col:20}))
            i(tokens[59]).should.equal(i({kind:'ID',lexeme:'speed',line:13,col:21}))
            i(tokens[60]).should.equal(i({kind:'*',lexeme:'*',line:13,col:27}))
            i(tokens[61]).should.equal(i({kind:'NUMLIT',lexeme:'1.1',line:13,col:29}))
            i(tokens[62]).should.equal(i({kind:'end',lexeme:'end',line:14,col:5}))
            i(tokens[63]).should.equal(i({kind:',',lexeme:',',line:14,col:8}))
            i(tokens[64]).should.equal(i({kind:'ID',lexeme:'get_frame',line:15,col:5}))
            i(tokens[65]).should.equal(i({kind:':',lexeme:':',line:15,col:14}))
            i(tokens[66]).should.equal(i({kind:'fn',lexeme:'fn',line:15,col:16}))
            i(tokens[67]).should.equal(i({kind:'(',lexeme:'(',line:15,col:19}))
            i(tokens[68]).should.equal(i({kind:')',lexeme:')',line:15,col:20}))
            i(tokens[69]).should.equal(i({kind:':',lexeme:':',line:15,col:21}))
            i(tokens[70]).should.equal(i({kind:'return',lexeme:'return',line:15,col:23}))
            i(tokens[71]).should.equal(i({kind:'ID',lexeme:'this',line:15,col:30}))
            i(tokens[72]).should.equal(i({kind:'.',lexeme:'.',line:15,col:34}))
            i(tokens[73]).should.equal(i({kind:'ID',lexeme:'frame',line:15,col:35}))
            i(tokens[74]).should.equal(i({kind:'end',lexeme:'end',line:15,col:41}))
            i(tokens[75]).should.equal(i({kind:'}',lexeme:'}',line:16,col:1}))
            i(tokens[76]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })

    it('reads escape characters properly', function (done) {
        scan('test/kobra-code/good-programs/escapecharacters.ks', function (tokens) {
            tokens.length.should.equal(17)
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'a',line:1,col:3}))
            i(tokens[2]).should.equal(i({kind:'=',lexeme:'=',line:1,col:5}))
            //  In output, an escape of escape will show.
            i(tokens[3]).should.equal(i({kind:'STRLIT',lexeme:'derp \\u0040 herp',line:1,col:7}))
            i(tokens[4]).should.equal(i({kind:'$',lexeme:'$',line:2,col:1}))
            i(tokens[5]).should.equal(i({kind:'ID',lexeme:'b',line:2,col:3}))
            i(tokens[6]).should.equal(i({kind:'=',lexeme:'=',line:2,col:5}))
            i(tokens[7]).should.equal(i({kind:'STRLIT',lexeme:'derp \\cA herp',line:2,col:7}))
            i(tokens[8]).should.equal(i({kind:'$',lexeme:'$',line:3,col:1}))
            i(tokens[9]).should.equal(i({kind:'ID',lexeme:'c',line:3,col:3}))
            i(tokens[10]).should.equal(i({kind:'=',lexeme:'=',line:3,col:5}))
            i(tokens[11]).should.equal(i({kind:'STRLIT',lexeme:'derp \\n herp',line:3,col:7}))
            i(tokens[12]).should.equal(i({kind:'$',lexeme:'$',line:4,col:1}))
            i(tokens[13]).should.equal(i({kind:'ID',lexeme:'d',line:4,col:3}))
            i(tokens[14]).should.equal(i({kind:'=',lexeme:'=',line:4,col:5}))
            i(tokens[15]).should.equal(i({kind:'STRLIT',lexeme:'derp \\x20 herp',line:4,col:7}))
            i(tokens[16]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })

    // Format for tests:
    // i(tokens[]).should.equal(i({kind:'',lexeme:'',line:,col:}))

})
