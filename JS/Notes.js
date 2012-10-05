// JS Sql syntax using C# LINQ

var queryResult = from row in Database.Person
				  where row.name == "Daniel"
				  select row;

// JS Sql syntax using linq.js:

var queryResult = Enumerable(Database).from(Person)
				  .where(function(x) {
					return x.name == "Daniel";
				  })
				  .select(function(x) {
					return x;
				  });


// JS Sql syntax using JS

var queryResult = Database.Person




// Things to think about
1. How to show answer
	a. Open a new window into which the answer can be injected
2. Timer for question responses (i.e. Time they have to answer)
3. Final Jeopardy
4. Daily Doubles
5. How to buzz in
	a. Web-Sockets FTW!