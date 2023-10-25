const easeFunc: { [funcName: string]: (x: number) => number } = {
  linear: function (x: number): number {
    return x;
  },

  //quad
  quad_in: function (x: number): number {
    return x * x;
  },
  quad_out: function (x: number): number {
    return 1 - (1 - x) * (1 - x);
  },
  quad_inout: function (x: number): number {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  },

  //cubic
  cubic_in: function (x: number): number {
    return x * x * x;
  },
  cubic_out: function (x: number): number {
    return 1 - Math.pow(1 - x, 3);
  },
  cubic_inout: function (x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  },

  //quart
  quart_in: function (x: number): number {
    return x * x * x * x;
  },
  quart_out: function (x: number): number {
    return 1 - Math.pow(1 - x, 4);
  },
  quart_inout: function (x: number): number {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  },

  //quint
  quint_in: function (x: number): number {
    return x * x * x * x * x;
  },
  quint_out: function (x: number): number {
    return 1 - Math.pow(1 - x, 5);
  },
  quint_inout: function (x: number): number {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  },

  //sine
  sine_in: function (x: number): number {
    return 1 - Math.cos((x * Math.PI) / 2);
  },
  sine_out: function (x: number): number {
    return Math.sin((x * Math.PI) / 2);
  },
  sine_inout: function (x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  },

  //expo
  expo_in: function (x: number): number {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  },
  expo_out: function (x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  },
  expo_inout: function (x: number): number {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2;
  },

  //circ
  circ_in: function (x: number): number {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
  },
  circ_out: function (x: number): number {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  },
  circ_inout: function (x: number): number {
    return x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  },

  //back
  back_in: function (x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * x * x * x - c1 * x * x;
  },
  back_out: function (x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  back_inout: function (x: number): number {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  },

  //elastic
  elastic_in: function (x: number): number {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
  },
  elastic_out: function (x: number): number {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  },
  elastic_inout: function (x: number): number {
    const c5 = (2 * Math.PI) / 4.5;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
  },

  //bounce
  bounce_in: function (x: number): number {
    return 1 - this.bounce_out(1 - x);
  },
  bounce_out: function (x: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  },
  bounce_inout: function (x: number): number {
    return x < 0.5
      ? (1 - this.bounce_out(1 - 2 * x)) / 2
      : (1 + this.bounce_out(2 * x - 1)) / 2;
  },
};

export default function getEaseFunc(
  funcName: string
): ((x: number) => number) | undefined {
  return easeFunc[funcName];
}

// export default easeFunc;
