import { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

function CategoryForm({ onSubmit }) {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('desc', desc);
        if (image) formData.append('image_file', image);

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <Typography variant="h6">Create or Update Category</Typography>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                fullWidth
            />
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </form>
    );
}
