const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const parseTime = (input) => {
    const time = new Date(1970, 0, 1);
    time.setSeconds(Math.floor(input)/1000);
    return `${time.toDateString()}`
}

module.exports = () => {
    
    //creates a log folder if it doesn't exists
    if (!fs.existsSync(path.join(__dirname, '..', '..', 'log'))) fs.mkdirSync(path.join(__dirname, '..', '..', 'log'));

    let filesToCompress = []

    //read the log dir
    const files = fs.readdirSync(path.join(__dirname, '..', '..', 'log'));
    
    //rename the log files with .tmp and push them to filesToCompress
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        //check if the file is a log
        if (path.extname(file) === '.log') {
            //rename
            fs.renameSync(path.join(__dirname, '..', '..', 'log', file), path.join(__dirname, '..', '..', 'log', file+".tmp"));
            //push
            filesToCompress.push(file+".tmp");
        }
    }
    
    //check if exists files to compress 
    if (filesToCompress.length > 0) {
        console.log('Compressing logs of the last session...')
        const archive = archiver('zip', {zlib: { level: 9 } });

        const outputFileName = parseTime(fs.statSync(path.join(__dirname, '..', '..', 'log', filesToCompress[0])).ctimeMs);

        const zips = fs.readdirSync(path.join(__dirname, '..', '..', 'log'));

        let zipsOfToday = 0;

        for (let i = 0; i < zips.length; i++) {
            const zip = zips[i];
            if ((path.extname(zip) === '.zip') && zip.indexOf(parseTime(fs.statSync(path.join(__dirname, '..', '..', 'log', filesToCompress[0])).ctimeMs)) === 0) {
                ++zipsOfToday;
            }
        }

        const outputFile = fs.createWriteStream(path.join(__dirname, '..', '..', 'log', outputFileName + "-" + zipsOfToday + '.zip'));
        archive.pipe(outputFile);

        for (let i = 0; i < filesToCompress.length; i++) {
            const fileName = filesToCompress[i];
            //compress each file
            archive.file(path.join(__dirname, '..', '..', 'log', fileName), { name: fileName.split('.')[0]+'.log' });
        }

        archive.on('progress', progress => {
            console.log(`[Log Manager] Processed: ${progress.entries.processed} of ${progress.entries.total} (${progress.fs.processedBytes} Bytes of ${progress.fs.totalBytes} Bytes)`);
            //check if all files are compressed
            if (progress.entries.processed === progress.entries.total) {
                console.log('[Log Manager] Compression done');
                //close the tar
                archive.finalize();
                //delete tmp files
                filesToCompress.forEach((file)=>{
                    fs.unlink(path.join(__dirname, '..', '..', 'log', file), ()=>{});
                })
            }
        })
    }
    
}