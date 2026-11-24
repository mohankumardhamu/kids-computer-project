import { useState } from 'react';
import type { Item } from '../data/levels';

const EXTENSIONS = ['jpg', 'png', 'webp', 'jpeg'];

/** Shows /photos/<id>.jpg (or png/webp). Falls back to the emoji if no photo has been added yet. */
interface Props { item: Item; size?: number }

// Keyed by item so the photo lookup restarts for every new part.
export function PartPhoto(props: Props) {
  return <Photo key={props.item.id} {...props} />;
}

function Photo({ item, size = 280 }: Props) {
  const [extIndex, setExtIndex] = useState(0);
  const failed = extIndex >= EXTENSIONS.length;

  return (
    <div className="photo" style={{ width: size, height: size }}>
      {failed ? (
        <span className="photo-emoji" style={{ fontSize: size * 0.45 }}>{item.emoji}</span>
      ) : (
        <img
          key={`${item.id}-${extIndex}`}
          src={`${import.meta.env.BASE_URL}photos/${item.id}.${EXTENSIONS[extIndex]}`}
          alt="A computer part"
          onError={() => setExtIndex((i) => i + 1)}
        />
      )}
    </div>
  );
}
