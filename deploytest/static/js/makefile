SHELL := /bin/bash
tester=~/phantomjs-2.1.1-linux-x86_64/bin/phantomjs

formationJsTest: formation.js formationJs_testCases.js
	cat formationJs_testCases.js formation.js > formationJsTestFile.js
	${tester} formationJsTestFile.js

.PHONY: clean
clean:
	rm *TestFile.js
