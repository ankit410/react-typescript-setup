import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const initialValue = `<p><img src="https://www.google.com/logos/google.jpg" width="388" height="127" alt="My alt text" data-mce-src="https://www.google.com/logos/google.jpg">This is the <cat23>initial</cat23> content of the editor.</p>`;

function TinyMce() {
  const editorRef = useRef<Editor['editor'] | null>(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const registerCustomElements = (
    elementNames: string[],
    editor: Editor['editor'],
  ) => {
    if (!editor) return;
    const customElementsObj: Parameters<
      typeof editor.schema.addCustomElements
    >[0] = {};

    elementNames.forEach((element) => {
      customElementsObj[element] = {
        extends: 'span',
        attributes: ['data-id', 'data-custom-element'],
      };
    });

    editor.schema.addCustomElements(customElementsObj);
  };

  const addCustomElement = (elementName: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.schema.addCustomElements({
      cat23: {
        extends: 'span',
        attributes: ['data-id', 'data-custom-element'],
      },
    });
    const selectedText = editor.selection.getContent();
    editor.selection.setContent(
      `<${elementName}>${selectedText}</${elementName}>`,
    );
  };

  return (
    <div>
      <button type="button" onClick={log}>
        Log editor content
      </button>
      <button type="button" onClick={() => addCustomElement('cat23')}>
        add custom content
      </button>

      <Editor
        apiKey="84kbwa4e7xdcepihpzvgd26ysdsguxdjob1ww5atonwrbc4f"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          registerCustomElements(['cat23'], editor);
        }}
        initialValue={initialValue}
        init={{
          height: 500,
          menubar: false,
          custom_elements: {
            cat: { extends: 'span' },
          },
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic underline strikethrough forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'table image ' +
            'removeformat | help',
          file_picker_callback(callback, value, meta) {
            /* Provide image and alt text for the image dialog */
            if (meta.filetype === 'image') {
              callback('https://www.google.com/logos/google.jpg', {
                alt: 'My alt text',
              });
            }
          },
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </div>
  );
}

export default TinyMce;
