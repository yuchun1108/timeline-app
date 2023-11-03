/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { arrayBuffToString, printToNewTab } from "../global/Common";
import {
  loadWorldAnim,
  worldAnimFromJson,
  worldAnimToJson,
} from "../global/Storage";
import { loadDemo, loadModel } from "../three/ModelLoader";
import World from "../three/World";

const css_h3 = css`
  font-family: sans-serif;
  font-size: 1.1em;
  text-align: center;
  margin: 4px;
`;

const css_div = css`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #2c393c;
  border-radius: 0 0 12px 0;
  color: white;
  padding: 6px 6px 6px 2px;
`;

const css_btn = css`
  width: 140px;
  height: 34px;
  font-size: 15px;
  margin: 4px 4px 4px 4px;
`;

const css_fileLoader = css`
  width: 0;
  height: 0;
  visibility: hidden;
`;

interface FileLoaderDivProps {
  world: World;
}

export default function FileLoaderDiv({ world }: FileLoaderDivProps) {
  const fileInputRef = useRef<any>(null);
  const animInputRef = useRef<any>(null);

  function onChange(e: any) {
    if (e.target.files.length <= 0) return;

    const fileName: string = e.target.files[0].name;

    const reader = new FileReader();

    reader.addEventListener("load", function (_e: any) {
      const arrBuff: ArrayBuffer = _e.target.result;

      loadModel(fileName, arrBuff)
        .then((object) => {
          world.setGroup(object);
          loadWorldAnim(world);

          const modelText = arrayBuffToString(arrBuff);
          localStorage.setItem("modelName", fileName);
          localStorage.setItem("model", modelText);

          e.target.value = null;
        })
        .catch((e) => {
          toast.error("An error occurred while reading the file");
          console.error(e);
        });
    });

    if (e.target.files.length > 0) reader.readAsArrayBuffer(e.target.files[0]);
  }

  function loadDemoScene(e: any) {
    world.clearGroup();
    localStorage.clear();

    loadDemo(world, true);
  }

  function exportAllAnim(e: any) {
    const json = worldAnimToJson(world, "\t").replace("\\t", "");
    printToNewTab(json);
  }

  function importAllAnim(e: any) {
    if (e.target.files.length <= 0) return;

    const reader = new FileReader();

    reader.addEventListener("load", (_e: any) => {
      // console.log(_e.target.result);
      try {
        worldAnimFromJson(world, _e.target.result);
      } catch (err) {
        console.error(err);
      }

      e.target.value = null;
    });

    if (e.target.files.length > 0) reader.readAsText(e.target.files[0]);
  }

  return (
    <div css={css_div}>
      <h3 css={css_h3}>Scene</h3>
      <button css={css_btn} onClick={loadDemoScene} className="btn">
        <span>Load Demo Model</span>
      </button>
      <br />
      <button
        css={css_btn}
        onClick={() => fileInputRef.current?.click()}
        className="btn"
      >
        {/* <FontAwesomeIcon icon={icon({ name: "file-import" })} /> */}
        <span>Import Model</span>
      </button>
      <input
        ref={fileInputRef}
        css={css_fileLoader}
        type="file"
        accept=".fbx,.glb,.gltf"
        onChange={onChange}
      />
      <h3 css={css_h3}>Anim</h3>

      <button css={css_btn} onClick={exportAllAnim} className="btn">
        <span>Export All Anim</span>
      </button>
      <br />

      <button
        css={css_btn}
        onClick={() => animInputRef.current?.click()}
        className="btn"
      >
        <span> Import All Anim</span>
      </button>
      <input
        ref={animInputRef}
        css={css_fileLoader}
        type="file"
        onChange={importAllAnim}
      />
    </div>
  );
}
