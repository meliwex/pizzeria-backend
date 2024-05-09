import fs from 'node:fs';

const deleteImg = (path) => {
  fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

export default deleteImg