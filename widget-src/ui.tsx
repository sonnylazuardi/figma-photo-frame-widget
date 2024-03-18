import * as ExifReader from "exifreader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Heic2Any from "heic2any";
import { domToPng } from "modern-screenshot";
import { useDropzone } from "react-dropzone";
const { useEffect, useRef, useState, useCallback } = React;
import "./ui.css";

function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ExifReader.Tags | null>(null);
  const refWrap = useRef<HTMLDivElement>(null);
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"],
    },
  });

  useEffect(() => {
    if (files) {
      (async () => {
        const file = files[0];
        const tags = await ExifReader.load(file);
        setMetadata(tags);
        if (file.name.toLowerCase().endsWith(".heic")) {
          const blob = await Heic2Any({ blob: file });
          setBlob(blob as Blob);
        } else {
          const blob = new Blob([file], { type: file.type });
          setBlob(blob);
        }
      })();
    }
  }, [files]);

  const handleResult = () => {
    parent.postMessage({ pluginMessage: { type: "image", data: result } }, "*");
  };

  useEffect(() => {
    if (isReady) {
      if (!window) return;
      if (!refWrap.current) return;
      refWrap.current.classList.remove("hidden");
      (async () => {
        let dataUrl = await domToPng(document.querySelector("#main")!);
        dataUrl = await domToPng(document.querySelector("#main")!);
        dataUrl = await domToPng(document.querySelector("#main")!);

        setResult(dataUrl);
        if (!refWrap.current) return;
        refWrap.current.classList.add("hidden");
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return (
    <div className="min-h-svh">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1 p-4">
          <a className={`btn btn-ghost text-lg font-semibold`}>Photo Frame</a>
        </div>
      </div>
      <div className="container mx-auto space-y-4 py-6 p-4">
        {files && !result ? (
          <p className="text-center">Processing...</p>
        ) : (
          <></>
        )}
        {result ? (
          <div className="space-y-4 flex items-center flex-col pb-40">
            <img src={result} className="max-w-sm w-full border" alt="Image" />
            <div className="flex gap-3 fixed bottom-0 left-0 right-0 bg-white p-4 justify-center">
              <button
                className="px-3 py-2 hover:bg-neutral-50 rounded-md"
                onClick={() => {
                  setFiles(null);
                  setBlob(null);
                  setIsReady(false);
                  setResult(null);
                }}
              >
                Generate Again
              </button>
              <button
                className="px-3 py-2 hover:bg-neutral-50 rounded-md"
                onClick={handleResult}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                  <path d="M7 11l5 5l5 -5" />
                  <path d="M12 4l0 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}

        {blob && metadata ? (
          <div className="border hidden w-fit mx-auto" ref={refWrap}>
            <div
              id="main"
              className="p-8 flex-col items-center space-y-10 mx-auto bg-white"
            >
              <div>
                <img
                  src={URL.createObjectURL(blob as Blob)}
                  onLoad={() => setIsReady(true)}
                  className="max-w-2xl"
                  alt="Image"
                />
              </div>
              <div className="text-center font-light text-gray-400 pb-3">
                {metadata?.Model?.description ||
                metadata?.["Device Manufacturer"]?.description ? (
                  <p className="text-2xl">
                    Shot on{" "}
                    <strong className="font-semibold text-black">
                      {metadata?.Model?.description ||
                        metadata?.["Device Manufacturer"]?.description}
                    </strong>
                  </p>
                ) : (
                  <></>
                )}
                <p className="text-lg mt-1 space-x-2">
                  {metadata?.FocalLengthIn35mmFilm?.description ? (
                    <span>
                      {metadata?.FocalLengthIn35mmFilm?.description}mm
                    </span>
                  ) : (
                    <></>
                  )}
                  {metadata?.FNumber?.description ? (
                    <span>{metadata?.FNumber?.description}</span>
                  ) : (
                    <></>
                  )}
                  {metadata?.ExposureTime?.description ? (
                    <span>{metadata?.ExposureTime?.description}s</span>
                  ) : (
                    <></>
                  )}
                  {metadata?.ISOSpeedRatings?.description ? (
                    <span>ISO{metadata?.ISOSpeedRatings?.description}</span>
                  ) : (
                    <></>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 flex flex-1 items-center flex-col">
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-neutral-200 rounded-2xl flex flex-1 flex-col items-center justify-center p-6 cursor-pointer min-h-64 w-full"
            >
              <img src={require("./images/logo.webp")} className="w-20 h-20" />
              <input {...getInputProps()} />
              <div className="text-sm text-neutral-500 text-center">
                {isDragActive ? (
                  <div>Drop the photo here ...</div>
                ) : (
                  <div>
                    Drag 'n' drop a photo here, or click here to select photo
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<Home />, document.getElementById("react-page"));
