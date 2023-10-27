import { ImageListProp } from "@/server/type";
import React from "react";
import Image from "next/image";
import styles from "./page.module.scss";
function Item({ data }: { data: ImageListProp["list"][number] }) {
  const { width, height, url, big_url, description } = data;
  // const description = tags?.[0]?.description;
  const basic = width > height ? 30 : 20;
  return (
    <div className={styles.itemContainer} key={url}>
      <a href={big_url} target="_blank">
        <Image
          width={width}
          height={height}
          alt={url}
          src={url}
          className={styles.image}
          style={{
            width: basic + "rem",
            height: `${(height / width) * basic}rem`,
          }}
          // layout="fixed"
          loading="lazy"
          quality={20}
          loader={({ src }) => src}
        />
      </a>

      <div className={styles.content}>
        <div className={styles.info}>
          <span>作者:{"白泽桃"}</span>
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
