//Begin.
lexer grammar L9_XML;


// Digits 0 to 9
fragment DIGIT: [0123456789];

// Uppercase and lowercase Latin letters (a-z, A-Z)
fragment ALPHA: [a-zA-Z];

// Creates a number. 
fragment NUMBER: DIGIT+;

// Wanting this to create a string that can contain letters, 
// digits, hyphens, underscores, and periods.
// NEED TO TEST THIS
fragment STRING: ( ALPHA | DIGIT | '-' | '_' | '.')*;

// Wanting to describe a string of text.
// NEED TO TEST THIS
fragment WORD: ALPHA*;


//										ELEMENT NAME RULES

// Want to describe a legal element name
// NEED TO TEST THIS
fragment ELEMENT_NAME: (ALPHA | '_' ) STRING;


//										EMAIL RULES

// Special characters allowed in local part of email
fragment SPECIAL_CHAR: [-_~!$&'()*+,;=:];

// Can contain letters, digits, special characters,
// and a period that is not the first character, and does not appear consecutively.
fragment LOCAL_PART: (ALPHA | DIGIT | SPECIAL_CHAR)
					 ((
					  (ALPHA|DIGIT|SPECIAL_CHAR|.)? // Optional to avoid requiring two characters.
					  (ALPHA|DIGIT|SPECIAL_CHAR)
					  )+  							// Grouping to avoid consecutive periods.
					 )*;							// None or more to avoid requiring a second character.

// Can contain letters, digits, hyphens, and dots. 
fragment DOMAIN_PART: (ALPHA | DIGIT | '-' | '.')*;

// localpart@domainpart is the legal form. 
fragment NODE_EMAIL: LOCAL_PART '@' DOMAIN_PART;

// Uncomment to test Email rules.
//ELEMENT: '<'ELEMENT_NAME'>'NODE_EMAIL'</'ELEMENT_NAME'>' { System.out.println("Success: "+getText()); };


//										DATE RULES
// Day must be number between 1 and 31
fragment DAY: ([0-2][0-9])|('3'[0-1]);

// Must be number between 1 and 12
fragment MONTH: ('0'[1-9])|('1'[0-2]);

// Must be number between 2000 and 2100
fragment YEAR: ('20' DIGIT DIGIT)|'2100';

// dd/mm/yyyy
fragment NODE_DATE: DAY'/'MONTH'/'YEAR;

//Uncomment to test Date rules. 
//ELEMENT: '<'ELEMENT_NAME'>'NODE_DATE'</'ELEMENT_NAME'>' { System.out.println("Success: "+getText()); };

//										PHONE RULES
//fragment NODE_PHONE: ;

//										CREDIT CARD RULES
//fragment NODE_CREDITCARD: ;