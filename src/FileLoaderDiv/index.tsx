/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { arrayBuffToString } from "../global/Common";
import { loadWorldAnim } from "../global/Storage";
import { loadModel } from "../three/ModelLoader";
import World from "../three/World";

const css_div = css`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #2c393c;
  border-radius: 0 0 12px 0;
  color: white;
  padding: 6px;
`;

const css_btn = css`
  width: 120px;
  height: 34px;
  font-size: 16px;
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
          // object.updateMatrixWorld(true);

          const modelText = arrayBuffToString(arrBuff);
          localStorage.setItem("modelName", fileName);
          localStorage.setItem("model", modelText);

          console.log(e);
          e.target.value = null;
        })
        .catch((e) => {
          console.log(e);
        });

      // if (fileName.toLowerCase().endsWith("fbx")) {
      //   loadFBX(arrBuff, world);
      // }
      // else
      // {
      //   loadGLTF(arrBuff, world);
      // }

      //
    });

    if (e.target.files.length > 0) {
    }

    if (e.target.files.length > 0) reader.readAsArrayBuffer(e.target.files[0]);
  }

  function onImportClick(e: any) {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function onClearClick(e: any) {
    world.clearGroup();
    localStorage.clear();
  }

  return (
    <div css={css_div}>
      <span
        data-tooltip-id="tooltip"
        data-tooltip-content="Import (fbx / glb / gltf)"
      >
        <button css={css_btn} onClick={onImportClick} className="btn">
          <FontAwesomeIcon icon={icon({ name: "file-import" })} />
          <span> Import</span>
        </button>
      </span>
      <input
        ref={fileInputRef}
        css={css_fileLoader}
        type="file"
        accept=".fbx,.glb,.gltf"
        onChange={onChange}
      ></input>
      <br />
      <span data-tooltip-id="tooltip" data-tooltip-content="Clear Scene">
        <button css={css_btn} onClick={onClearClick} className="btn">
          <FontAwesomeIcon icon={icon({ name: "trash" })} />
          <span> Clear</span>
        </button>
      </span>
    </div>
  );
}
