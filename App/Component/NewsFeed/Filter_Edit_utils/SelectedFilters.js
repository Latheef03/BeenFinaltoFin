import React from "react";
import {
  Normal,
  Sepia,
  Warm,
  Cool,
  Grayscale,
  Vintage,
  Tint,
  ToBGR,
  Invert,
  Technicolor,
  Polaroid,
  Brightness,
  Contrast,
  Saturate,
} from "react-native-color-matrix-image-filters";
import { View } from "react-native";
import FData from "./FiltersData";

export default (SelectedFilters = ({ images, childrenComponent }) => {
  const { filterId } = images;
  const fID = filterId;
  return (
    <View>
      {fID == 0 && (
        <NormalFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 1 && (
        <SepiaFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 2 && (
        <WarmFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 3 && (
        <CoolFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 4 && (
        <GrayscaleFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 5 && (
        <VintageFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 6 && (
        <TintFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 7 && (
        <ToBGRFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 8 && (
        <InvertFilt sImages={images} childrenComponent={childrenComponent} />
      )}
      {fID == 9 && (
        <TechnicolorFilt
          sImages={images}
          childrenComponent={childrenComponent}
        />
      )}
      {fID == 10 && (
        <PolaroidFilt sImages={images} childrenComponent={childrenComponent} />
      )}
    </View>
  );
});

const NormalFilt = ({ sImages, childrenComponent }) => (
  <Normal>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Normal>
);

const SepiaFilt = ({ sImages, childrenComponent }) => {
  // console.log('the sepiafilt',sImages);
  return(
  <Sepia>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Sepia>
)};

const WarmFilt = ({ sImages, childrenComponent }) => (
  <Warm>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Warm>
);

const CoolFilt = ({ sImages, childrenComponent }) => (
  <Cool>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Cool>
);

const GrayscaleFilt = ({ sImages, childrenComponent }) => (
  <Grayscale>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Grayscale>
);

const VintageFilt = ({ sImages, childrenComponent }) => (
  <Vintage>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Vintage>
);

const TintFilt = ({ sImages, childrenComponent }) => (
  <Tint>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Tint>
);

const ToBGRFilt = ({ sImages, childrenComponent }) => (
  <ToBGR>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </ToBGR>
);

const InvertFilt = ({ sImages, childrenComponent }) => (
  <Invert>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Invert>
);
const TechnicolorFilt = ({ sImages, childrenComponent }) => (
  <Technicolor>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Technicolor>
);

const PolaroidFilt = ({ sImages, childrenComponent }) => (
  <Polaroid>
    <Brightness amount={sImages.BSV ? sImages.BSV : 1}>
      <Contrast amount={sImages.CSV ? sImages.CSV : 1}>
        <Brightness amount={sImages.LSV ? sImages.LSV : 1}>
          <Saturate amount={sImages.SSV ? sImages.SSV : 1}>
            {childrenComponent}
          </Saturate>
        </Brightness>
      </Contrast>
    </Brightness>
  </Polaroid>
);
