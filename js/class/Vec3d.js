class Vec3d {
    x = 0.0
    y = 0.0
    z = 0.0

    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }


    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    normalize() {
        let l = this.length()
        return new Vec3d(this.x / l, this.y / l, this.z / l)
    }

    multiply(n) {
        return new Vec3d(this.x * n, this.y * n, this.z * n)
    }

    add(vec) {
        return new Vec3d(this.x + vec.x, this.y + vec.y, this.z + vec.z)
    }

    remove(vec) {
        return new Vec3d(this.x - vec.x, this.y - vec.y, this.z - vec.z)
    }

}