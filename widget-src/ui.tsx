import * as ExifReader from "exifreader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Heic2Any from "heic2any";
import { domToPng } from "modern-screenshot";
const { useEffect, useRef, useState } = React;
import "./ui.css";

function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ExifReader.Tags | null>(null);
  const refWrap = useRef<HTMLDivElement>(null);

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
          <a className={`btn btn-ghost text-3xl`}>What The Frame</a>
        </div>
      </div>
      <div className="container mx-auto space-y-4 py-6 p-2">
        {files && !result ? (
          <p className="text-center">Processing...</p>
        ) : (
          <></>
        )}
        {result ? (
          <div className="space-y-4 flex items-center flex-col">
            <img src={result} className="max-w-sm w-full border" alt="Image" />
            <div className="flex gap-3">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setFiles(null);
                  setBlob(null);
                  setIsReady(false);
                  setResult(null);
                }}
              >
                Generate Again
              </button>
              <a
                className="btn btn-neutral cursor-pointer p-4"
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
              </a>
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
          <div className="space-y-4 flex items-center flex-col">
            <input
              type="file"
              multiple={false}
              className="file-input w-full max-w-xs"
              onChange={(e) => setFiles(e.target.files)}
              accept="image/*,.heic"
            />
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<Home />, document.getElementById("react-page"));
