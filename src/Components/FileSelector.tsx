import { ChangeEvent, useState } from 'react';
import './fileSelector.css'

export const FileSelector = ({ setFile }: { setFile: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null | undefined>> }) => {
    const [fileName, setFileName] = useState<File>()

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFileName(e.target.files[0])
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = (e?.target?.result)
                setFile(text);

            };
            reader.readAsText(e.target.files[0])
        }
    };

    return (
        <div className='fileSelector'>
            <input type="file" onChange={handleFileChange} />
            <div>{fileName && `${fileName.name} - ${fileName.type}`}</div>

        </div>
    );
}
