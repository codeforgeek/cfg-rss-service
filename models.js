function getAllArticles(callback) {
    global.db.collection('posts').aggregate([
        {
            $lookup: {
                from: 'users',
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

    // global.db.collection('posts').find({}).limit(20).sort({
    //     date: -1
    // }).toArray((err, result) => {
    //     if (err) {
    //         return callback(true, 'error retrieving posts.');
    //     }
    //     callback(false, result);
    // });
}

module.exports = {
    getAllArticles: getAllArticles,
}