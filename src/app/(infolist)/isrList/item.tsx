import { ImageListProp } from "@/server/type";
import React from "react";
import styles from "./page.module.scss";
function Item({ data }: { data: ImageListProp["images"][number] }) {
  const { width, height, url, image_id, artist, tags } = data;
  const description = tags?.[0]?.description;
  return (
    <div className={styles.itemContainer} key={image_id}>
      <a href={url} target="_blank">
        <img
          className={styles.image}
          style={{
            height: `${(height / width) * 20}rem`,
          }}
          src={`${url}?w=248&fit=crop&auto=format`}
          srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
          loading="lazy"
        />
      </a>

      <div className={styles.content}>
        <div className={styles.info}>
          <span>作者:{artist?.name ?? "白泽桃"}</span>
          <span>
            尺寸:{width}x{height}
          </span>
        </div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}

export default Item;
