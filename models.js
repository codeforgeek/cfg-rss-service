function getAllArticles(callback) {
    global.db.collection('posts').aggregate([
        {
            $lookup: {
                from: 'authors',
                localField: 'author',
                foreignField: 'id',
                as: 'authorData'
            }
        }
    ]).limit(20).sort({ date: -1 }).toArray((err, results) => {
        if (err) {
            return callback(true, 'error retrieving posts.');
        }        
        callback(false, results);
    });
}

module.exports = {
    getAllArticles: getAllArticles,
}
