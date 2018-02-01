// route with dropdown and list
var hn = require('hacker-news-api');
var sw = require('stopword');

module.exports = (app) => {
	app.get('/list', (req, res) => {
		function wordSplitting (titleString) {
			// split string by spaces (including spaces, tabs, and newlines)
			let wordsArray1 = titleString.split(/\s+/);
			return wordsArray1;
		};
		function wordRemoval (wordsArray1) {
			// frequently used words to ignore/remove from wordsArray
			let wordsArray2 = sw.removeStopwords(wordsArray1)
			return wordsArray2;
		};
		function wordMapping (wordsArray2) {
			// create map for word counts				
			let wordsMap = {};
			wordsArray2.forEach(function(key) {
				if(wordsMap.hasOwnProperty(key)) {
					wordsMap[key]++;
				} else {
					wordsMap[key] = 1;
				}
			});
			return wordsMap;	
		};
		function wordSorting (wordsMap) {
			// sort by count in descending order
			let finalWordsArray = [];
			finalWordsArray = Object.keys(wordsMap).map(function (key) {
				return {
					name: key,
					total: wordsMap[key]
				};
			});
			finalWordsArray.sort(function (a, b) {
				return b.total - a.total;
			});
			return finalWordsArray;
		};
		//Search for last 25 stories
		hn.story().search().hitsPerPage(25).recent(function (error, data) {
			if (error) throw error;
			let hits25 = []
			for (var i = 0; i < data.hits.length; i++) {
				hits25.push(data.hits[i].title);
			};
			let latest25String = hits25.join(" ")
			console.log('latest25String', latest25String)

			let wordsArray1 = wordSplitting(latest25String);
			let wordsArray2 = wordRemoval(wordsArray1)
			let wordsMap = wordMapping(wordsArray2);
			let finalWordsArray = wordSorting(wordsMap);

			let top25Array = finalWordsArray.slice(0, 10)
			return top25Array
			// console.log('25 wordsArray2', wordsArray2)
			// console.log('25 wordsMap', wordsMap)
			// console.log('25 finalWordsArray', finalWordsArray);
			// console.log('25 top25Array', top25Array)
		}); 
		// Search for week ago
		hn.story().search().hitsPerPage(100).before('past_week', function (error, data) {
			if (error) throw error;
			let hitsweek = []
			for (var i = 0; i < data.hits.length; i++) {
				hitsweek.push(data.hits[i].title);
			};
			let weekString = hitsweek.join(" ")
			console.log('weekString', weekString)

			let wordsArray1 = wordSplitting(weekString);
			let wordsArray2 = wordRemoval(wordsArray1)
			let wordsMap = wordMapping(wordsArray2);
			let finalWordsArray = wordSorting(wordsMap);

			let topWeekArray = finalWordsArray.slice(0, 10)
			// console.log('week wordsArray2', wordsArray2)
			// console.log('week wordsMap', wordsMap)
			// console.log('week finalWordsArray', finalWordsArray);
			// console.log('topWeekArray', topWeekArray)
			res.render('list', {
				// top25Array: top25Array,
				topWeekArray: topWeekArray
			});
		});		
	});
};