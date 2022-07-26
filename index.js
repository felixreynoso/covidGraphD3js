const express = require('express');
const app = express();
const port = 3000;
var mysql = require('mysql');
const bodyParser = require('body-parser');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    var countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Diamond Princess', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'MS Zaandam', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Summer Olympics 2020', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan*', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'US', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'West Bank and Gaza', 'Winter Olympics 2022', 'Yemen', 'Zambia', 'Zimbabwe'];

    var region = req.query.region || 'Global';
    var timeFrame = req.query.timeFrame || '1';

    if (region == 'Global')
        var sql_query = "SELECT * FROM covid";
    else
        var sql_query = `SELECT * FROM covid where country = '${region}'`;

    con.query(sql_query, function (err, result, fields) {
        if (err) throw err;

        var data = tidyResults(result, timeFrame);

        res.render('pages/index', {
            countries: countries,
            timeFrames: [[7, "Last Week"], [30, "Last Month"], [365, "Last Year"]],
            timeFrame: timeFrame,
            region: region,
            data: data
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// const con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "covid"
// });
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "test",
    password: "reynosociprian",
    database: "covid",

});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


function tidyResults(results, timeFrame) {

    var data = [];
    results.forEach((row, idx) => {
        var values = (Object.values(row).slice(-timeFrame));
        var columnNames = (Object.keys(row).slice(-timeFrame));
        data.push({
            x: values,
            from: columnNames[0],
            to: columnNames[columnNames.length - 1]
        });
    });
    
    if (data.length == 1) {
        return data[0];
    }
    else if (data.length > 1) {
        var from = data[0].from;
        var to = data[0].to;
        var x = new Array(data[0].x.length).fill(0);

        for (var i = 0; i < data.length; i++){
            for (var j = 0; j < timeFrame; j++){ 
                if (!isNaN(parseInt(data[i].x[j])))
                    x[j] += parseInt(data[i].x[j])
            }
        }

        from = from.replace(/_/g, '/');
        to = to.replace(/_/g, '/');
        return {from: from, to: to, x: x}
    }
    else {
        return null
    } 
}


// ALTER USER 'test'@'localhost' IDENTIFIED WITH mysql_native_password BY 'reynosociprian';