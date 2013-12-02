var mongoose = require('mongoose')
	, Helpers = require('./ControllerHelpers')
	//, owl = require('../public/JS/libs/pluralize.js');

exports.CreateQuestion = function(req, res)
{
	var questionData = req.params['Question'],
		QuestionModel = mongoose.model('Question');

	var question = new QuestionModel(questionData);
	question.save(function (err, newQuestion)
	{
		var rtObj = {};
		if(err)
		{
			rtObj.Error = err;
		}
		else
		{
			rtObj.Record = newQuestion;
		}

		res.json(rtObj);
	});
}
exports.CreateQuestionPost = exports.CreateQuestion;


exports.CreateCategory = function(req, res)
{
	var categoryData = req.params['Category'],
		CategoryModel = mongoose.model('Category');

	var category = new CategoryModel(categoryData);
	category.save(function (err, newCategory)
	{
		var rtObj = {};
		if(err)
			rtObj.Error = err;
		else
			rtObj.Record = newCategory;

		res.json(rtObj);
	});
}
exports.CreateCategoryPost = exports.CreateCategory;


exports.GetTables = function(req, res)
{
	var CategoryModel = mongoose.model('Category'),
		QuestionModel = mongoose.model('Question');
	CategoryModel.find({})
		.populate('Questions')
		.exec(function (err, categories)
		{
			var rtObj = {};
			if(err)
			{
				rtObj.Error = err;
				res.json(rtObj);
			}
			else
			{
				var tableInfo = BuildTableInfo(CategoryModel, categories);
				rtObj.Tables = [tableInfo];

				QuestionModel.find({})
					.populate('Category', 'Name ID')
					.exec(function (err, questions)
					{
						if(err)
						{
							rtObj.Error = err;
							res.json(rtObj);
						}
						else
						{
							var records = [];
							for(var key in questions)
							{
								var question = questions[key];
								records.push({
									ID: question._id,
									Question: question.Question,
									Answer: question.Answer,
									Value: question.Value,
									Category: question.Category ? question.Category.Name : undefined
								});
							}

							rtObj.Tables.push(BuildTableInfo(QuestionModel, records));

							res.json(rtObj);
						}
					});
			}
		});
}
exports.GetTablesPost = exports.GetTables;

function BuildTableInfo(model, records)
{
	var rtObj = {
		Name: model.modelName,
		Records: records,
		Columns: []
	};

	var regex = /^_.*/;

	for(var key in model.schema.paths)
	{
		var data = model.schema.paths[key];
		
		if(!regex.test(key) && !Array.isArray(data.options.type))
		{
			var col = {
				name: key,
				required: data.isRequired,
				primaryKey: data._index != undefined,
				hasDefault: data.defaultValue != undefined
			};

			if(data.options.ref)
			{
				// is part of a collection
				col.foreignKey = true;
				col.reference = data.options.ref;
			}

			rtObj.Columns.push(col);
		}
	}

	return rtObj;
}

exports.InsertRow = function(req, res)
{
	var table = req.query.tableName;
	var row = req.query.row;
	InsertHelper(req, res, table, row);
}
exports.InsertRowPost = function(req, res)
{
	var table = req.params.tableName;
	var row = req.params.row;
	InsertHelper(req, res, table, row);
}
function InsertHelper(req, res, table, row)
{
	var Model = mongoose.model(table);
	Model.create(row, function(err, newModel)
	{
		if(err)
		{
			res.json({ Error: err });
		}
		else
		{
			if(row.ForeignKeys)
			{
				// row.ForeignKeys.forEach(function(key)
				// {
					var key = row.ForeignKeys[0];
					var ParentModel = mongoose.model(key);
					ParentModel.findOne({ _id : row[key] }, function(err, record)
					{
						if(err)
							res.json({ Error: err });
						else
						{
							var collectionName = owl.pluralize(table);
							record[collectionName].push(newModel);
							record.save(function(err)
							{
								if(err)
									res.json({ Error: err });
								else
								{
									var foreignKeys = { };
									foreignKeys[key] = record.Name;

									res.json({ Row: newModel, ForeignKeys: foreignKeys });
								}
							});
						}
					});
				//});
			}
			else
				res.json({ Row: newModel });
		}
	});
}

exports.UpdateRow = function(req, res)
{
	var table = req.query.tableName;
	var row = req.query.row;

	UpdateHelper(req, res, table, row);
}
exports.UpdateRowPost = function(req, res)
{
	var table = req.params.tableName;
	var row = req.params.row;

	UpdateHelper(req, res, table, row);
}
function UpdateHelper(req, res, table, row)
{
	var Model = mongoose.model(table);
	Model.findOne({ _id: row.ID })
		.exec(function(err, model)
		{
			if(err)
			{
				res.json({ Error: err });
			}
			else
			{
				for(var key in row)
				{
					if(row.ForeignKeys && row.ForeignKeys.indexOf(key) >= 0)
						continue;

					model[key] = row[key];
				}

				model.save(function(err)
				{
					if(err)
						res.json({ Error: err.message });
					else
						res.json({ Row: model });
				});
			}
		});
}

exports.DeleteRow = function(req, res)
{
	var table = req.query.tableName;
	var rowID = req.query.rowID;

	DeleteHelper(req, res, table, rowID);
}
exports.DeleteRowPost = function(req, res)
{
	var table = req.params.tableName;
	var rowID = req.params.rowID;

	DeleteHelper(req, res, table, rowID);
};
function DeleteHelper(req, res, table, rowID)
{
	var Model = mongoose.model(table);
	Model.findOne({ _id: rowID })
		.exec(function(err, model)
		{
			if(err)
				res.json({ Error: err });
			else
			{
				if(model)
					model.remove(function(err)
					{
						if(err)
							res.json({ Error: err });
						else
							res.json({ Success: true, Row: model });
					});
				else
					res.json({ Error: "Could not find error." });
			}
		});
}

exports.ExportDB = function(req, res)
{
	res.json({ Success: false });
}
exports.ExportDBPost = function(req, res)
{
	res.json({ Success: false });
};
function ExportHelper(req, res, table)
{

};

exports.ImportDB = function(req, res)
{
	res.json({ Success: false });
};
exports.ImportDBPost = function(req, res)
{
	res.json({ Success: false });
};
function ImportHelper(req, res, database)
{

}




/* This file is part of OWL Pluralization.

OWL Pluralization is free software: you can redistribute it and/or 
modify it under the terms of the GNU Lesser General Public License
as published by the Free Software Foundation, either version 3 of
the License, or (at your option) any later version.

OWL Pluralization is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public 
License along with OWL Pluralization.  If not, see 
<http://www.gnu.org/licenses/>.
*/

// prepare the owl namespace.
if ( typeof owl === 'undefined' ) owl = {};

owl.pluralize = (function() {
	var userDefined = {};

	function capitalizeSame(word, sampleWord) {
		if ( sampleWord.match(/^[A-Z]/) ) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		} else {
			return word;
		}
	}

	// returns a plain Object having the given keys,
	// all with value 1, which can be used for fast lookups.
	function toKeys(keys) {
		keys = keys.split(',');
		var keysLength = keys.length;
		var table = {};
		for ( var i=0; i < keysLength; i++ ) {
			table[ keys[i] ] = 1;
		}
		return table;
	}

	// words that are always singular, always plural, or the same in both forms.
	var uninflected = toKeys("aircraft,advice,blues,corn,molasses,equipment,gold,information,cotton,jewelry,kin,legislation,luck,luggage,moose,music,offspring,rice,silver,trousers,wheat,bison,bream,breeches,britches,carp,chassis,clippers,cod,contretemps,corps,debris,diabetes,djinn,eland,elk,flounder,gallows,graffiti,headquarters,herpes,high,homework,innings,jackanapes,mackerel,measles,mews,mumps,news,pincers,pliers,proceedings,rabies,salmon,scissors,sea,series,shears,species,swine,trout,tuna,whiting,wildebeest,pike,oats,tongs,dregs,snuffers,victuals,tweezers,vespers,pinchers,bellows,cattle");

	var irregular = {
		// pronouns
		I: 'we',
		you: 'you',
		he: 'they',
		it: 'they',  // or them
		me: 'us',
		you: 'you',
		him: 'them',
		them: 'them',
		myself: 'ourselves',
		yourself: 'yourselves',
		himself: 'themselves',
		herself: 'themselves',
		itself: 'themselves',
		themself: 'themselves',
		oneself: 'oneselves',

		child: 'children',
		dwarf: 'dwarfs',  // dwarfs are real; dwarves are fantasy.
		mongoose: 'mongooses',
		mythos: 'mythoi',
		ox: 'oxen',
		soliloquy: 'soliloquies',
		trilby: 'trilbys',
		person: 'people',
		forum: 'forums', // fora is ok but uncommon.

		// latin plural in popular usage.
		syllabus: 'syllabi',
		alumnus: 'alumni', 
		genus: 'genera',
		viscus: 'viscera',
		stigma: 'stigmata'
	};

	var suffixRules = [
		// common suffixes
		[ /man$/i, 'men' ],
		[ /([lm])ouse$/i, '$1ice' ],
		[ /tooth$/i, 'teeth' ],
		[ /goose$/i, 'geese' ],
		[ /foot$/i, 'feet' ],
		[ /zoon$/i, 'zoa' ],
		[ /([tcsx])is$/i, '$1es' ],

		// fully assimilated suffixes
		[ /ix$/i, 'ices' ],
		[ /^(cod|mur|sil|vert)ex$/i, '$1ices' ],
		[ /^(agend|addend|memorand|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi)um$/i, '$1a' ],
		[ /^(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)on$/i, '$1a' ],
		[ /^(alumn|alg|vertebr)a$/i, '$1ae' ],
		
		// churches, classes, boxes, etc.
		[ /([cs]h|ss|x)$/i, '$1es' ],

		// words with -ves plural form
		[ /([aeo]l|[^d]ea|ar)f$/i, '$1ves' ],
		[ /([nlw]i)fe$/i, '$1ves' ],

		// -y
		[ /([aeiou])y$/i, '$1ys' ],
		[ /(^[A-Z][a-z]*)y$/, '$1ys' ], // case sensitive!
		[ /y$/i, 'ies' ],

		// -o
		[ /([aeiou])o$/i, '$1os' ],
		[ /^(pian|portic|albin|generalissim|manifest|archipelag|ghett|medic|armadill|guan|octav|command|infern|phot|ditt|jumb|pr|dynam|ling|quart|embry|lumbag|rhin|fiasc|magnet|styl|alt|contralt|sopran|bass|crescend|temp|cant|sol|kimon)o$/i, '$1os' ],
		[ /o$/i, 'oes' ],

		// words ending in s...
		[ /s$/i, 'ses' ]
	];

	// pluralizes the given singular noun.  There are three ways to call it:
	//   pluralize(noun) -> pluralNoun
	//     Returns the plural of the given noun.
	//   Example: 
	//     pluralize("person") -> "people"
	//     pluralize("me") -> "us"
	//
	//   pluralize(noun, count) -> plural or singular noun
	//   Inflect the noun according to the count, returning the singular noun
	//   if the count is 1.
	//   Examples:
	//     pluralize("person", 3) -> "people"
	//     pluralize("person", 1) -> "person"
	//     pluralize("person", 0) -> "people"
	//
	//   pluralize(noun, count, plural) -> plural or singular noun
	//   you can provide an irregular plural yourself as the 3rd argument.
	//   Example:
	//     pluralize("château", 2 "châteaux") -> "châteaux"
	function pluralize(word, count, plural) {
		// handle the empty string reasonably.
		if ( word === '' ) return '';

		// singular case.
		if ( count === 1 ) return word;

		// life is very easy if an explicit plural was provided.
		if ( typeof plural === 'string' ) return plural;

		var lowerWord = word.toLowerCase();

		// user defined rules have the highest priority.
		if ( lowerWord in userDefined ) {
			return capitalizeSame(userDefined[lowerWord], word);
		}

		// single letters are pluralized with 's, "I got five A's on
		// my report card."
		if ( word.match(/^[A-Z]$/) ) return word + "'s";

		// some word don't change form when plural.
		if ( word.match(/fish$|ois$|sheep$|deer$|pox$|itis$/i) ) return word;
		if ( word.match(/^[A-Z][a-z]*ese$/) ) return word;  // Nationalities.
		if ( lowerWord in uninflected ) return word;

		// there's a known set of words with irregular plural forms.
		if ( lowerWord in irregular ) {
			return capitalizeSame(irregular[lowerWord], word);
		}
		
		// try to pluralize the word depending on its suffix.
		var suffixRulesLength = suffixRules.length;
		for ( var i=0; i < suffixRulesLength; i++ ) {
			var rule = suffixRules[i];
			if ( word.match(rule[0]) ) {
				return word.replace(rule[0], rule[1]);
			}
		}

		// if all else fails, just add s.
		return word + 's';
	}

	pluralize.define = function(word, plural) {
		userDefined[word.toLowerCase()] = plural;
	}

	return pluralize;

})();
